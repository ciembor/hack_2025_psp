"""
Docstring for cyber-niesmiertelnik.repo.hack_2025_psp.hardware.alivemodule.main

Kod powstał podczas wydarzenia HackNation na potrzeby zadania Cyfrowy-Niesmiertelnik

kapefx@gmail.com

"""

from controller_esp import Controller
from sx127x import SX127x
import time
import json
import machine, utime
import network
from machine import Pin, I2C

NODE_ID = "FF-001"  # TO BE DEFINED FOR EACH MODULE
NODE_START = utime.time()
rtc = machine.RTC()

# --- I²C setup ---
i2c = I2C(scl=Pin(22), sda=Pin(21))  # ESP32 pins
MPU_ADDR = 0x69   # or 0x68 depending on AD0 wiring

# --- Wake up MPU ---
i2c.writeto_mem(MPU_ADDR, 0x6B, b'\x00')

# --- Helper to read 16-bit signed values ---
def read_word(reg):
    high = i2c.readfrom_mem(MPU_ADDR, reg, 1)[0]
    low = i2c.readfrom_mem(MPU_ADDR, reg + 1, 1)[0]
    val = (high << 8) | low
    if val >= 0x8000:
        val = -((65535 - val) + 1)
    return val

# --- Accelerometer ---
def read_accel():
    ax = read_word(0x3B) / 16384.0   # scale ±2g
    ay = read_word(0x3D) / 16384.0
    az = read_word(0x3F) / 16384.0
    return ax, ay, az

# --- Gyroscope ---
def read_gyro():
    gx = read_word(0x43) / 131.0     # scale ±250 °/s
    gy = read_word(0x45) / 131.0
    gz = read_word(0x47) / 131.0
    return gx, gy, gz

# --- Complementary filter ---
pitch, roll = 0.0, 0.0
alpha = 0.98   # filter coefficient

# --- WiFi Access Point ---
ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid=NODE_ID, password="12345678")

controller = Controller()
lora = SX127x(controller)
controller.add_transceiver(
    lora,
    pin_id_ss=Controller.PIN_ID_FOR_LORA_SS,
    pin_id_RxDone=Controller.PIN_ID_FOR_LORA_DIO0
)

# --- LoRa config ---
params = {
    'frequency': 433E6,
    'signal_bandwidth': 125E3,
    'spreading_factor': 7,
    'coding_rate': 5,
    'sync_word': 0x12,
    'tx_power_level': 14,
    'implicitHeader': False,
    'preamble_length': 8,
    'enable_CRC': False
}
lora.init(params)

# --- Main loop ---
while True:
    timeS = utime.time()

    ax, ay, az = read_accel()
    gx, gy, gz = read_gyro()

    readings = {
        "imu": {
            "acc": (ax, ay, az),
            "gyro": (gx, gy, gz)
        }
    }

    payload = {
        "node": NODE_ID,
        "startpoint": NODE_START,
        "sensors": readings,
        "timestamp": timeS
    }

    # Convert dict -> JSON string
    json_str = json.dumps(payload)

    # Prepend header - to identify message
    packet_str = NODE_ID + json_str

    # Convert to bytes for LoRa
    packet_bytes = packet_str.encode("utf-8")

    # Send packet
    lora.beginPacket(False)
    lora.write(packet_bytes)
    lora.endPacket()

    time.sleep(1)
