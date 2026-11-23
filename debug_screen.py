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
    # Start the MCP proxy
    proc = subprocess.Popen(
        ["cmd", "/c", "npx", "@_davideast/stitch-mcp", "proxy"],
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
    
    project_id = "11347591501043409899"
    
    # Just test one screen
    screen_id = "4ff9bb9e5a4249838b4bc19f50a5dcf7"
    screen_name = "Dashboard_2"
    
    screen_response = send_request(proc, "tools/call", {
        "name": "get_screen",
        "arguments": {"name": f"projects/{project_id}/screens/{screen_id}"}
    }, 100)
    
    print(json.dumps(screen_response, indent=2))
    
    proc.terminate()

if __name__ == "__main__":
    main()