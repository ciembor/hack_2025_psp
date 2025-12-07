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
import re
import os
from machine import UART,Pin, I2C
import time, math


NODE_ID = "Anchor-C"
RECEIVER = "Anchor-B"  # define which anchor will receive messages from this node
NODE_START = utime.time()
rtc = machine.RTC()





def saveToJSON(filename, message):
    if isinstance(message, str):
        data = {"message": message}
    elif isinstance(message, dict):
        data = message
    else:
        raise TypeError("Message must be a dict or string")

    with open(filename, "w") as f:
        json.dump(data, f)

    print(f"Batch message saved to {filename}")


controller = Controller()
lora = SX127x(controller)

controller.add_transceiver(
    lora,
    pin_id_ss=Controller.PIN_ID_FOR_LORA_SS,
    pin_id_RxDone=Controller.PIN_ID_FOR_LORA_DIO0
)

sta = network.WLAN(network.STA_IF)
sta.active(True)

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

lora.receive()
print("Receiver started...")

packedMessage = {}
ffMessage = {}
batchLoop = True

while True:  
    messageBatch = {}
    start = utime.time()
    
    while utime.time() - start <= 2:  

       
        irq = lora.readRegister(0x12)  # REG_IRQ_FLAGS
        rssi_raw = lora.readRegister(0x2C)

        if irq & 0x40:  # RX_DONE
            current_addr = lora.readRegister(0x10)   # FIFO_RX_CURRENT_ADDR
            lora.writeRegister(0x0D, current_addr)   # FIFO_ADDR_PTR
            length = lora.readRegister(0x13)         # RX_NB_BYTES

            payload = []
            for i in range(length):
                payload.append(lora.readRegister(0x00))

            lora.writeRegister(0x12, 0x40)

            # wifi
            try:
                # Scan for networks
                nets = sta.scan()  # returns list of tuples
                # Each tuple: (ssid, bssid, channel, RSSI, authmode, hidden)
                for ssid, bssid, channel, rssi, authmode, hidden in nets:
                    ssid_str = ssid.decode() if isinstance(ssid, bytes) else ssid

                    if "FF-" in ssid:  # filter out only fire fighters
                        data = {
                            "nodeId": ssid,
                            "rssi": rssi
                        }
                        messageId = utime.time()

                        data.update({
                            "id": messageId,
                            "ccMessage": False,
                            "protocol": 'wifi',
                            "node":NODE_ID
                        })
                    else:
                        data = 'no_wifi_signal'

                messageBatch[messageId] = data

            except ValueError:
                print("Received no Wifi signal")

            # LORA communication
            try:
                text = bytes(payload).decode("utf-8")

                if text.startswith("FF") or text.startswith(NODE_ID):  # Anchor is sending only directly to the defined receiver
                    text = text[text.find('{'):]
                    data = json.loads(text)
                    messageId = utime.time()
                    data.update({
                        "LoraRssi": rssi_raw,
                        "id": messageId,
                        "ccMessage": False,  # not direct message for command center
                        "protocol": 'lora',
                        "anchor": NODE_ID
                    })
                    messageBatch[messageId] = data

            except ValueError:
                print("Received non-JSON message:", text)

    # after 10 seconds
    batchID = utime.time()
    try:
        fName = "C_" + data['node'] + '_' + str(batchID) + ".json"
    except:
        fName = "C_" + str(batchID) + ".json"
    saveToJSON(fName, messageBatch)

    with open(fName, "r") as file:
        content = file.read()
    print('content: ', content)
    content = "Anchor-B" + content
    msg = content.encode("utf-8")
    print(msg)
    lora.beginPacket(False)
    lora.write(msg)
    lora.endPacket()
    print("Sent file:", fName)

    time.sleep(0.1)
    # os.remove(fname)
    # print(f"File {fname} removed.")
    lora.receive()
    print("Receiver re-enabled after sending files")

    """
    # files = os.listdir()   # list all files in root
    # filesList = [f for f in files if f.endswith(".json")]

    # if len(filesList) >= 2:  # after x files, to be changed. be aware that there is a limit in bytes to be sent over LoRa 250bytes max.
    # print(filesList)
    for fname in filesList:
        with open(fname, "r") as file:
            content = file.read()
        print('content: ', content)
        content = "BASE" + content
        msg = content.encode("utf-8")
        print(msg)
        lora.beginPacket(False)
        lora.write(msg)
        lora.endPacket()
        print("Sent file:", fname)

        time.sleep(0.1)
        os.remove(fname)
        print(f"File {fname} removed.")
    lora.receive()
    print("Receiver re-enabled after sending files")
    """
