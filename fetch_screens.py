#!/usr/bin/env python3
import json
import subprocess
import sys
import time

def send_request(proc, method, params=None, id=None):
    request = {
        "jsonrpc": "2.0",
        "method": method,
        "id": id or 1
    }
    if params:
        request["params"] = params
    
    proc.stdin.write((json.dumps(request) + "\n").encode())
    proc.stdin.flush()
    
    # Read response
    line = proc.stdout.readline()
    if not line:
        return None
    return json.loads(line.decode())

def main():
    # Start the MCP proxy
    proc = subprocess.Popen(
        ["cmd", "/c", "npx", "@_davideast/stitch-mcp", "proxy"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env={**subprocess.os.environ, "STITCH_API_KEY": "AQ.Ab8RN6JFjNCvyx3xIUPmlgwzUBGc1RnmdAkMQQttulJLijlVew"}
    )
    
    # Wait for server to start
    time.sleep(2)
    
    # Initialize
    init_response = send_request(proc, "initialize", {
        "protocolVersion": "2024-11-05",
        "capabilities": {},
        "clientInfo": {"name": "test-client", "version": "1.0.0"}
    }, 1)
    print("Initialize:", json.dumps(init_response, indent=2))
    
    # List tools
    tools_response = send_request(proc, "tools/list", {}, 2)
    print("Tools:", json.dumps(tools_response, indent=2))
    
    # Get screens for project
    project_id = "11347591501043409899"
    
    # Call get_screen for each screen
    screens = [
        "01bfe9606d7344ebba6d41f6fae0d322",
        "ee68cbede37e4cc3bd1c1849a8d62e07",
        "af4d5f07c4364a1f9faec56b2b185372",
        "710a30042eae4db88952a97936c8705f",
        "feebcdd1bd4e4389832e810c688fc6bb",
        "15426868615872275831",
        "10894242959854186820",
        "7e17fa01588a46e99d4c0f3a1dc6add5",
        "f7b9656198a6470bacaf3932baf561c2",
        "1eab89b7650448b69ef77f09c0aed76c",
        "4ff9bb9e5a4249838b4bc19f50a5dcf7",
        "a50eee061797439e921b815b423d4677",
        "e2a8dd98f7dc4d0688d317cc2dcf6a9b",
        "d53043de7a8244b68f582137fa5aa4d2",
        "7598075465057123855",
        "4e0133c8d8864432ace6dd210d0033b5",
        "2162900239718695249",
        "a92d6284e650489f8725b1a107a89c0e"
    ]
    
    for i, screen_id in enumerate(screens):
        screen_response = send_request(proc, "tools/call", {
            "name": "get_screen",
            "arguments": {"name": f"projects/{project_id}/screens/{screen_id}"}
        }, 100 + i)
        print(f"Screen {screen_id}:", json.dumps(screen_response, indent=2))
    
    proc.terminate()

if __name__ == "__main__":
    main()