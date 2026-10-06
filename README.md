\# Network Ping \& Port Scanner



A Python-based command-line network scanning tool that performs host reachability checks, TCP port scanning, service detection, multithreaded scanning, and automated report generation.



\## Features



\* Hostname/IP address resolution

\* Host reachability using Ping

\* TCP port scanning

\* Single-port scanning

\* Port-range scanning

\* Common service detection

\* Multithreaded port scanning

\* Configurable thread count

\* Command-line interface

\* JSON report generation

\* TXT report generation

\* Automated testing using Pytest

\* Scan execution time measurement



\## Technologies Used



\* Python 3

\* Socket Programming

\* TCP/IP Networking

\* ThreadPoolExecutor

\* Argparse

\* JSON

\* Pytest

\* PowerShell



\## Project Structure



```text

network-scanner/

│

├── .venv/

│

├── results/

│   ├── scan\_report.json

│   └── scan\_report.txt

│

├── tests/

│   └── test\_scanner.py

│

├── scanner.py

├── requirements.txt

└── README.md

```



\## How It Works



```text

User Input

&#x20;   │

&#x20;   ▼

Hostname / IP Resolution

&#x20;   │

&#x20;   ▼

Host Reachability Check

&#x20;   │

&#x20;   ▼

Port Range Parsing

&#x20;   │

&#x20;   ▼

Multithreaded TCP Scanning

&#x20;   │

&#x20;   ▼

Service Detection

&#x20;   │

&#x20;   ▼

Scan Results

&#x20;   │

&#x20;   ├──────────────┐

&#x20;   ▼              ▼

JSON Report     TXT Report

```



\## Installation



Clone or download the project and open a terminal inside the project directory.



Create a virtual environment:



```powershell

python -m venv .venv

```



Activate it:



```powershell

.venv\\Scripts\\activate

```



Install dependencies:



```powershell

pip install -r requirements.txt

```



\## Usage



Display help:



```powershell

python scanner.py --help

```



Scan a single port:



```powershell

python scanner.py --host 127.0.0.1 --ports 8080

```



Scan a range of ports:



```powershell

python scanner.py --host 127.0.0.1 --ports 8000-8100

```



Specify the number of concurrent threads:



```powershell

python scanner.py --host 127.0.0.1 --ports 8000-8100 --threads 20

```



\## Local Testing



For safe local testing, start a Python HTTP server:



```powershell

python -m http.server 8080

```



Then run:



```powershell

python scanner.py --host 127.0.0.1 --ports 8000-8100

```



The scanner should identify port `8080` as open.



\## Example Output



```text

=======================================================

&#x20;            NETWORK PING \& PORT SCANNER

=======================================================



Target      : 127.0.0.1

Resolved IP : 127.0.0.1



\[\*] Checking host reachability...

\[+] Host is reachable



\[\*] Threads    : 100



\[\*] Scanning ports 8000-8100...

\-------------------------------------------------------

PORT      STATE       SERVICE

\-------------------------------------------------------

8080      OPEN        HTTP-Alt

\-------------------------------------------------------



Scan time: 0.05 seconds



=======================================================

&#x20;                   SCAN SUMMARY

=======================================================



Target        : 127.0.0.1

Ports scanned : 101

Open ports    : 1



Open ports:

&#x20; 8080   HTTP-Alt



=======================================================

```



\## Reports



After a scan, reports are generated inside the `results` directory.



\### JSON Report



```text

results/scan\_report.json

```



JSON provides structured scan information that can be consumed by other applications, APIs, or dashboards.



\### TXT Report



```text

results/scan\_report.txt

```



TXT provides a human-readable version of the scan results.



\## Testing



Run all automated tests:



```powershell

pytest

```



For detailed test output:



```powershell

pytest -v

```



The tests verify:



\* Localhost resolution

\* Single-port parsing

\* Port-range parsing

\* Invalid-port handling

\* Service detection



\## Security and Responsible Use



This tool should only be used on systems, networks, and hosts that you own or have explicit permission to test.



For development and demonstration, use:



```text

127.0.0.1

```



or another authorized test environment.



\## Future Enhancements



Possible future improvements include:



\* CSV report generation

\* Custom output filenames

\* OS/service fingerprinting

\* Banner grabbing

\* Configurable socket timeout

\* Scan progress indicator

\* Graphical user interface

\* Web dashboard

\* Database storage

\* Docker deployment

\* Network vulnerability checks

\* Exportable scan history



\## Learning Outcomes



This project demonstrates practical knowledge of:



\* Python programming

\* Computer networking

\* TCP/IP concepts

\* Socket programming

\* Concurrent programming

\* Command-line application development

\* File handling

\* JSON data processing

\* Software testing

\* Network security fundamentals



\## Author



\*\*Sharmila K Y\*\*



Computer Science Engineering Student



Interested in Artificial Intelligence, Software Engineering, Networking, and Cybersecurity.



