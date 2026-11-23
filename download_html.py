#!/usr/bin/env python3
import json
import subprocess
import sys
import time
import urllib.request
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

def download_html(url, output_path):
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0',
            'Authorization': 'Bearer AQ.Ab8RN6JFjNCvyx3xIUPmlgwzUBGc1RnmdAkMQQttulJLijlVew'
        })
        with urllib.request.urlopen(req) as response:
            content = response.read().decode('utf-8')
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(content)
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

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
    
    screens = [
        ("01bfe9606d7344ebba6d41f6fae0d322", "Dashboard"),
        ("ee68cbede37e4cc3bd1c1849a8d62e07", "Riwayat_Pergerakan"),
        ("af4d5f07c4364a1f9faec56b2b185372", "Daftar_Batch_Sterilisasi"),
        ("710a30042eae4db88952a97936c8705f", "Konfirmasi_Penerimaan_Alat"),
        ("feebcdd1bd4e4389832e810c688fc6bb", "Detail_Laporan"),
        ("15426868615872275831", "ui-batch-4"),
        ("10894242959854186820", "ui-batch-3"),
        ("7e17fa01588a46e99d4c0f3a1dc6add5", "Alat_Keluar_Distribusi"),
        ("f7b9656198a6470bacaf3932baf561c2", "Daftar_Laporan"),
        ("1eab89b7650448b69ef77f09c0aed76c", "Status_Alat"),
        ("4ff9bb9e5a4249838b4bc19f50a5dcf7", "Dashboard_2"),
        ("a50eee061797439e921b815b423d4677", "Data_Alat"),
        ("e2a8dd98f7dc4d0688d317cc2dcf6a9b", "Manajemen_User"),
        ("d53043de7a8244b68f582137fa5aa4d2", "Detail_Batch_Sterilisasi"),
        ("7598075465057123855", "ui-batch-1"),
        ("4e0133c8d8864432ace6dd210d0033b5", "Alat_Masuk"),
        ("2162900239718695249", "ui-batch-2"),
        ("a92d6284e650489f8725b1a107a89c0e", "Login"),
    ]
    
    output_dir = "stitch-html"
    os.makedirs(output_dir, exist_ok=True)
    
    for i, (screen_id, screen_name) in enumerate(screens):
        screen_response = send_request(proc, "tools/call", {
            "name": "get_screen",
            "arguments": {"name": f"projects/{project_id}/screens/{screen_id}"}
        }, 100 + i)
        
        if screen_response and "result" in screen_response:
            structured = screen_response["result"].get("structuredContent", {})
            html_code = structured.get("htmlCode", {})
            download_url = html_code.get("downloadUrl")
            mime_type = html_code.get("mimeType", "")
            
            if download_url:
                ext = ".html" if "html" in mime_type else ".md" if "markdown" in mime_type else ".txt"
                output_path = os.path.join(output_dir, f"{screen_name}{ext}")
                print(f"Downloading {screen_name} from {download_url}...")
                download_html(download_url, output_path)
            else:
                print(f"No download URL for {screen_name}")
    
    proc.terminate()
    print("Done!")

if __name__ == "__main__":
    main()