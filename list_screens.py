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
    
    line = proc.stdout.readline()
    if not line:
        return None
    return json.loads(line.decode())

def main():
    proc = subprocess.Popen(
        ["cmd", "/c", "npx", "stitch-pro-mcp"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env={**subprocess.os.environ, "STITCH_API_KEY": "AQ.Ab8RN6JFjNCvyx3xIUPmlgwzUBGc1RnmdAkMQQttulJLijlVew"}
    )
    
    time.sleep(2)
    
    init_response = send_request(proc, "initialize", {
        "protocolVersion": "2024-11-05",
        "capabilities": {},
        "clientInfo": {"name": "test-client", "version": "1.0.0"}
    }, 1)
    
    project_id = "11347591501043409899"
    
    # List screens
    screens_response = send_request(proc, "tools/call", {
        "name": "sp_screens",
        "arguments": {"projectId": project_id}
    }, 2)
    
    print(json.dumps(screens_response, indent=2))
    
    proc.terminate()

if __name__ == "__main__":
    main()