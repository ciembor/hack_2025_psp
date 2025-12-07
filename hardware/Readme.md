# Moduł Alive - hardware
## dokumentacja dotycząca hardware 

### Struktura katalogów alivemodule i anchors
Foldery zawierają sterowniki i skrypty konfiguracyjne dla mikrokontrolera ESP32

GŁÓWNYM PLIKIEM jest zawsze ### main.py w który znajduje się wykonywany na mikrokontrolerze kod automatycznie po jego uruchomieniu. To w nim jest część odpowiedzialna za przesyłanie danych i konfigurację w jaki sposób ma działać mikrokontroler


### core.py 
Docelowo główny silnik i miejsce przeliczania, interpretowania wszystkich danych.

### hardware-description.pdf
Plik z opisem/ dokumentacją warstwy hardware