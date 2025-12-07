import json
import numpy as np
import math


def importJSON(fileName):
    """Load JSON file and return data."""
    with open(f"{fileName}.json") as f:
        data = json.load(f)
    return data


def saveJSON(inputDict, fileName):
    """Save dictionary to JSON file."""
    with open(f"{fileName}.json", "w") as f:
        json.dump(inputDict, f, indent=4)


def multilaterate(anchors, distances):
    """
    Estimate 2D position from multiple anchors using least-squares multilateration.
    anchors   : dict of {"Node A": (x,y), "Node B": (x,y), ...}
    distances : dict of {"Node A": dA, "Node B": dB, ...}
    """
    labels = list(anchors.keys())
    coords = np.array([anchors[label] for label in labels], dtype=float)
    dists = np.array([distances[label] for label in labels], dtype=float)

    # Use the first anchor as reference
    x0, y0 = coords[0]
    d0 = dists[0]

    A, b = [], []
    for (xi, yi), di in zip(coords[1:], dists[1:]):
        A.append([2 * (xi - x0), 2 * (yi - y0)])
        b.append((d0**2 - di**2) - (x0**2 - xi**2) - (y0**2 - yi**2))

    A = np.array(A)
    b = np.array(b)
    pos, _, _, _ = np.linalg.lstsq(A, b, rcond=None)
    return pos[0], pos[1]


def createLocalGrid(coordList):
    """
    Convert GPS coordinates to local XY grid (meters).
    coordList: list of (lat, lon)
    """
    lat0, lon0 = coordList[0]
    lat0Rad = math.radians(lat0)

    # Earth radius approximations
    metersPerDegLat = 111132.92 - 559.82 * math.cos(2 * lat0Rad) + 1.175 * math.cos(4 * lat0Rad)
    metersPerDegLon = 111412.84 * math.cos(lat0Rad) - 93.5 * math.cos(3 * lat0Rad)

    localCoords = []
    for lat, lon in coordList:
        dLat = lat - lat0
        dLon = lon - lon0
        northMeters = dLat * metersPerDegLat
        eastMeters = dLon * metersPerDegLon
        xCoord = -eastMeters   # west is negative X
        yCoord = northMeters   # north is positive Y
        localCoords.append((xCoord, yCoord))

    return localCoords


if __name__ == '__main__':
    # Example anchors JSON file: anchors.json
    # {
    #   "nodes": [
    #       {"id": "A", "GPS": [52.0, 18.0]},
    #       {"id": "B", "GPS": [52.0005, 18.0005]},
    #       {"id": "C", "GPS": [52.001, 18.0]}
    #   ]
    # }

    anchorsData = importJSON("anchors")
    gpsCoords = [node["GPS"] for node in anchorsData["nodes"]]

    # Convert GPS to local XY
    localCoords = createLocalGrid(gpsCoords)

    # Example distances (pretend measurements)
    anchorsDict = {node["id"]: coord for node, coord in zip(anchorsData["nodes"], localCoords)}
    distancesDict = {"A": 10.0, "B": 12.0, "C": 9.5}

    # Estimate position
    estimatedPos = multilaterate(anchorsDict, distancesDict)

    # Save results
    result = {
        "polygonCoords": anchorsDict,
        "estimatedPosition": estimatedPos
    }
    saveJSON(result, "output")

    print("Estimated position:", estimatedPos)
