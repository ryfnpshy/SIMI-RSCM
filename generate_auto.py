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
    
    # Try sp_auto to generate the whole app
    auto_response = send_request(proc, "tools/call", {
        "name": "sp_auto",
        "arguments": {
            "prompt": "Build a complete hospital inventory management system (SIM Inventori RS) with Next.js React, Tailwind CSS, and shadcn/ui. Include: Dashboard, Login, Data Alat (Equipment List), Alat Masuk (Equipment In), Alat Keluar/Distribusi (Equipment Out), Status Alat, Riwayat Pergerakan (Movement History), Daftar Laporan (Reports List), Detail Laporan, Daftar Batch Sterilisasi (Sterilization Batch List), Detail Batch Sterilisasi, Konfirmasi Penerimaan Alat (Equipment Receipt Confirmation), Manajemen User (User Management). Use a clean medical/healthcare design system with blue/teal colors.",
            "projectId": project_id,
            "outputDir": "./stitch-generated"
        }
    }, 3)
    
    print(json.dumps(auto_response, indent=2))
    
    proc.terminate()

if __name__ == "__main__":
    main()