from machine import UART
import time

# Initialize UART for GPS (adjust pins to your wiring)
uart = UART(2, baudrate=9600, tx=17, rx=16)

def parse_gpgga(sentence):
    """
    Parse GPGGA sentence for fix quality, satellites in use, coordinates, and altitude.
    """
    parts = sentence.split(',')
    if len(parts) < 15:
        return None

    fix_quality = parts[6]  # 0 = no fix, 1 = GPS fix, 2 = DGPS fix
    num_sats = parts[7]     # satellites in use
    altitude = parts[9]     # altitude above mean sea level (meters)

    if fix_quality == '0':
        return fix_quality, num_sats, None, None, None

    lat_raw = parts[2]
    lat_dir = parts[3]
    lon_raw = parts[4]
    lon_dir = parts[5]

    if not lat_raw or not lon_raw:
        return fix_quality, num_sats, None, None, altitude

    # Convert ddmm.mmmm to decimal degrees
    lat_deg = float(lat_raw[:2])
    lat_min = float(lat_raw[2:])
    lon_deg = float(lon_raw[:3])
    lon_min = float(lon_raw[3:])

    lat = lat_deg + lat_min/60.0
    lon = lon_deg + lon_min/60.0

    if lat_dir == 'S':
        lat = -lat
    if lon_dir == 'W':
        lon = -lon

    return fix_quality, num_sats, lat, lon, altitude

def parse_gpgsv(sentence):
    """
    Parse GPGSV sentence for satellites in view.
    """
    parts = sentence.split(',')
    if len(parts) < 4:
        return None
    return parts[3]  # total satellites in view

# Main loop
while True:
    if uart.any():
        line = uart.readline()
        if line:
            try:
                sentence = line.decode('utf-8').strip()

                if sentence.startswith("$GPGGA"):
                    fix_quality, num_sats, lat, lon, alt = parse_gpgga(sentence)
                    if fix_quality == "0":
                        print("No fix yet. Satellites in use:", num_sats)
                    else:
                        print("Fix acquired! Satellites in use:", num_sats)
                        if lat and lon:
                            print("Latitude:", lat, "Longitude:", lon)
                        if alt:
                            print("Altitude:", alt, "m")

                elif sentence.startswith("$GPGSV"):
                    total_sats = parse_gpgsv(sentence)
                    print("Satellites in view:", total_sats)

            except Exception:
                pass
    time.sleep(0.1)
