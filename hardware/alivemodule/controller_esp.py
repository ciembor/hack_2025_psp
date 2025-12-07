# controller_esp.py

from machine import Pin, SPI
import time
import config_lora
import controller

# --- Platform specific defaults ---
DEFAULT_LED_PIN = 2 if config_lora.IS_ESP32 else 2
DEFAULT_LED_HIGH_IS_ON = True if config_lora.IS_ESP32 else False

class Controller(controller.Controller):
    # RA-02 wiring (ESP32)
    PIN_ID_FOR_LORA_RESET = 16
    PIN_ID_FOR_LORA_SS    = 5
    PIN_ID_SCK            = 18
    PIN_ID_MOSI           = 23
    PIN_ID_MISO           = 19
    PIN_ID_FOR_LORA_DIO0  = 4

    def __init__(self,
                 pin_id_led=None,
                 on_board_led_high_is_on=None,
                 pin_id_reset=PIN_ID_FOR_LORA_RESET,
                 blink_on_start=(1, 0.2, 0.2)):

        if pin_id_led is None:
            pin_id_led = DEFAULT_LED_PIN
        if on_board_led_high_is_on is None:
            on_board_led_high_is_on = DEFAULT_LED_HIGH_IS_ON

        super().__init__(pin_id_led, on_board_led_high_is_on, pin_id_reset, blink_on_start)

    def prepare_pin(self, pin_id, in_out=Pin.OUT):
        if pin_id is None:
            return None
        pin = Pin(pin_id, in_out)
        p = Controller.Mock()
        p.pin_id = pin_id
        p.value = pin.value
        if in_out == Pin.OUT:
            p.low = lambda: pin.value(0)
            p.high = lambda: pin.value(1)
        else:
            p.irq = pin.irq
        return p

    def prepare_irq_pin(self, pin_id):
        pin = self.prepare_pin(pin_id, Pin.IN)
        if pin:
            pin.set_handler_for_irq_on_rising_edge = lambda handler: pin.irq(handler=handler, trigger=Pin.IRQ_RISING)
            pin.detach_irq = lambda: pin.irq(handler=None, trigger=0)
        return pin

    def get_spi(self):
        try:
            # Use VSPI (id=2) with the standard pins: SCK=18, MOSI=23, MISO=19
            spi = SPI(2, baudrate=1000000, polarity=0, phase=0, bits=8,
                      sck=Pin(self.PIN_ID_SCK),
                      mosi=Pin(self.PIN_ID_MOSI),
                      miso=Pin(self.PIN_ID_MISO))
            return spi
        except Exception as e:
            print("SPI init failed:", e)
            return None

    def prepare_spi(self, spi):
        if not spi:
            return None

        ss = self.prepare_pin(self.PIN_ID_FOR_LORA_SS, Pin.OUT)
        ss.high()  # idle high

        new_spi = Controller.Mock()

        def transfer(pin_ss, address, value=0x00):
            # Address MSB=0 for read, MSB=1 for write (driver sets it)
            pin_ss.low()
            # small settle time for CS
            time.sleep_us(3)
            spi.write(bytes([address & 0xFF]))
            resp = bytearray(1)
            spi.write_readinto(bytes([value & 0xFF]), resp)
            time.sleep_us(2)
            pin_ss.high()
            # post CS idle
            time.sleep_us(2)
            return resp

        new_spi.transfer = transfer
        new_spi.close = spi.deinit
        return new_spi

    def __exit__(self):
        if self.spi:
            self.spi.close()
