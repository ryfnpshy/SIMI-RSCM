#!/usr/bin/env python3
import json
import subprocess
import sys
import time
import os

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
    
    line = proc.stdout.readline()
    if not line:
        return None
    return json.loads(line.decode())

def main():
    # Try stitch-pro-mcp
    proc = subprocess.Popen(
        ["cmd", "/c", "npx", "stitch-pro-mcp"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env={**subprocess.os.environ, "STITCH_API_KEY": "AQ.Ab8RN6JFjNCvyx3xIUPmlgwzUBGc1RnmdAkMQQttulJLijlVew"}
    )
    
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
    
    proc.terminate()

if __name__ == "__main__":
    main()