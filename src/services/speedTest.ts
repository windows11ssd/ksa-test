
interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  ipAddress: string;
  serverLocation: string;
  timestamp: number;
  fileSize: number;
}

interface ServerInfo {
  ip: string;
  location: string;
  country: string;
}

// Optimized test file URLs with better sizes for faster testing
const TEST_FILES = {
  1024: 'https://speed.cloudflare.com/__down?bytes=1048576', // 1MB
  5120: 'https://speed.cloudflare.com/__down?bytes=5242880', // 5MB
  10240: 'https://speed.cloudflare.com/__down?bytes=10485760', // 10MB
  51200: 'https://speed.cloudflare.com/__down?bytes=52428800', // 50MB
  102400: 'https://speed.cloudflare.com/__down?bytes=104857600', // 100MB
  512000: 'https://speed.cloudflare.com/__down?bytes=524288000', // 500MB
  1024000: 'https://speed.cloudflare.com/__down?bytes=1073741824', // 1GB
};

// Faster backup servers
const BACKUP_TEST_FILES = {
  1024: 'https://httpbin.org/bytes/1048576',
  5120: 'https://httpbin.org/bytes/5242880', 
  10240: 'https://httpbin.org/bytes/10485760',
  51200: 'https://httpbin.org/bytes/52428800',
  102400: 'https://httpbin.org/bytes/104857600',
  512000: 'https://httpbin.org/bytes/524288000',
  1024000: 'https://httpbin.org/bytes/1073741824',
};

class SpeedTestService {
  private abortController: AbortController | null = null;

  async getServerInfo(): Promise<ServerInfo> {
    try {
      // Create timeout controller
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), 5000);
      
      const response = await fetch('https://ipapi.co/json/', { 
        signal: timeoutController.signal
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();
      
      return {
        ip: data.ip,
        location: `${data.city}, ${data.region}`,
        country: data.country_name
      };
    } catch (error) {
      // Quick fallback
      return {
        ip: 'Unknown',
        location: 'Saudi Arabia',
        country: 'Saudi Arabia'
      };
    }
  }

  async measurePing(attempts: number = 3): Promise<number> {
    const pingResults: number[] = [];
    
    for (let i = 0; i < attempts; i++) {
      const startTime = performance.now();
      
      try {
        await fetch('https://www.google.com/favicon.ico', { 
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: this.abortController?.signal 
        });
        
        const endTime = performance.now();
        pingResults.push(endTime - startTime);
      } catch (error) {
        pingResults.push(999); // High ping for failed attempts
      }
      
      // Reduced delay between attempts
      if (i < attempts - 1) await this.delay(50);
    }
    
    // Return median ping
    const sortedPings = pingResults.sort((a, b) => a - b);
    const median = Math.floor(sortedPings.length / 2);
    return Math.round(sortedPings[median]);
  }

  async measureDownloadSpeed(fileSizeKB: number): Promise<number> {
    const fileSize = fileSizeKB as keyof typeof TEST_FILES;
    let testUrl = TEST_FILES[fileSize];
    
    // Single attempt for speed, with fallback
    try {
      const startTime = performance.now();
      
      const response = await fetch(testUrl, {
        signal: this.abortController?.signal,
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      
      let downloadedBytes = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        downloadedBytes += value?.length || 0;
      }
      
      const endTime = performance.now();
      const durationSeconds = (endTime - startTime) / 1000;
      const speedMbps = (downloadedBytes * 8) / (durationSeconds * 1000000);
      
      return Math.round(speedMbps * 100) / 100;
      
    } catch (error) {
      // Single backup attempt
      try {
        const backupUrl = BACKUP_TEST_FILES[fileSize];
        const startTime = performance.now();
        const response = await fetch(backupUrl, {
          signal: this.abortController?.signal,
          cache: 'no-cache'
        });
        
        const data = await response.arrayBuffer();
        const endTime = performance.now();
        
        const durationSeconds = (endTime - startTime) / 1000;
        const speedMbps = (data.byteLength * 8) / (durationSeconds * 1000000);
        
        return Math.round(speedMbps * 100) / 100;
      } catch {
        throw new Error('Download test failed');
      }
    }
  }

  async measureUploadSpeed(fileSizeKB: number): Promise<number> {
    // Use smaller upload size for speed (max 5MB)
    const uploadSize = Math.min(fileSizeKB, 5120);
    const testData = new ArrayBuffer(uploadSize * 1024);
    const view = new Uint8Array(testData);
    
    // Fill with simple pattern for speed
    for (let i = 0; i < view.length; i++) {
      view[i] = i % 256;
    }
    
    try {
      const startTime = performance.now();
      
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: testData,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        signal: this.abortController?.signal
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      await response.text();
      const endTime = performance.now();
      
      const durationSeconds = (endTime - startTime) / 1000;
      const speedMbps = (testData.byteLength * 8) / (durationSeconds * 1000000);
      
      return Math.round(speedMbps * 100) / 100;
      
    } catch (error) {
      throw new Error('Upload test failed');
    }
  }

  async runFullTest(fileSizeKB: number, onProgress?: (step: string) => void): Promise<SpeedTestResult> {
    this.abortController = new AbortController();
    
    try {
      onProgress?.('Getting server info...');
      const serverInfo = await this.getServerInfo();
      
      onProgress?.('Measuring ping...');
      const ping = await this.measurePing(3); // Reduced attempts
      
      onProgress?.('Testing download speed...');
      const downloadSpeed = await this.measureDownloadSpeed(fileSizeKB);
      
      onProgress?.('Testing upload speed...');
      const uploadSpeed = await this.measureUploadSpeed(fileSizeKB);
      
      const result: SpeedTestResult = {
        downloadSpeed,
        uploadSpeed,
        ping,
        ipAddress: serverInfo.ip,
        serverLocation: serverInfo.location,
        timestamp: Date.now(),
        fileSize: fileSizeKB
      };
      
      // Save to localStorage
      this.saveTestResult(result);
      
      return result;
    } catch (error) {
      throw new Error('Speed test failed: ' + (error as Error).message);
    }
  }

  private saveTestResult(result: SpeedTestResult) {
    const history = this.getTestHistory();
    history.unshift(result);
    
    // Keep only last 50 results
    if (history.length > 50) {
      history.splice(50);
    }
    
    localStorage.setItem('ksatest-history', JSON.stringify(history));
  }

  getTestHistory(): SpeedTestResult[] {
    try {
      const history = localStorage.getItem('ksatest-history');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  clearHistory() {
    localStorage.removeItem('ksatest-history');
  }

  abort() {
    this.abortController?.abort();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const speedTestService = new SpeedTestService();
export type { SpeedTestResult, ServerInfo };
