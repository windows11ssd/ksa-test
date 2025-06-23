
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

// Real test file URLs with different sizes
const TEST_FILES = {
  1024: 'https://speed.cloudflare.com/__down?bytes=1048576', // 1MB
  5120: 'https://speed.cloudflare.com/__down?bytes=5242880', // 5MB
  10240: 'https://speed.cloudflare.com/__down?bytes=10485760', // 10MB
  51200: 'https://speed.cloudflare.com/__down?bytes=52428800', // 50MB
  102400: 'https://speed.cloudflare.com/__down?bytes=104857600', // 100MB
  512000: 'https://speed.cloudflare.com/__down?bytes=524288000', // 500MB
  1024000: 'https://speed.cloudflare.com/__down?bytes=1073741824', // 1GB
};

// Alternative test servers for better accuracy
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
      // Use multiple IP services for better accuracy
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        ip: data.ip,
        location: `${data.city}, ${data.region}`,
        country: data.country_name
      };
    } catch (error) {
      try {
        // Fallback to another service
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return {
          ip: data.ip,
          location: 'Saudi Arabia',
          country: 'Saudi Arabia'
        };
      } catch {
        return {
          ip: 'Unknown',
          location: 'Saudi Arabia',
          country: 'Saudi Arabia'
        };
      }
    }
  }

  async measurePing(attempts: number = 5): Promise<number> {
    const pingResults: number[] = [];
    
    for (let i = 0; i < attempts; i++) {
      const startTime = performance.now();
      
      try {
        // Use a reliable ping endpoint
        await fetch('https://www.google.com/favicon.ico', { 
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: this.abortController?.signal 
        });
        
        const endTime = performance.now();
        pingResults.push(endTime - startTime);
      } catch (error) {
        // If ping fails, try alternative
        try {
          await fetch('https://httpbin.org/status/200', { 
            method: 'HEAD',
            signal: this.abortController?.signal 
          });
          const endTime = performance.now();
          pingResults.push(endTime - startTime);
        } catch {
          pingResults.push(999); // High ping for failed attempts
        }
      }
      
      // Small delay between ping attempts
      await this.delay(100);
    }
    
    // Return average ping, excluding outliers
    const sortedPings = pingResults.sort((a, b) => a - b);
    const middle = Math.floor(sortedPings.length / 2);
    return Math.round(sortedPings[middle]);
  }

  async measureDownloadSpeed(fileSizeKB: number): Promise<number> {
    const fileSize = fileSizeKB as keyof typeof TEST_FILES;
    let testUrl = TEST_FILES[fileSize];
    
    // Multiple attempts for accuracy
    const speeds: number[] = [];
    
    for (let attempt = 0; attempt < 3; attempt++) {
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
        
        speeds.push(speedMbps);
        
      } catch (error) {
        console.log(`Download attempt ${attempt + 1} failed, trying backup server`);
        
        // Try backup server
        testUrl = BACKUP_TEST_FILES[fileSize];
        
        try {
          const startTime = performance.now();
          const response = await fetch(testUrl, {
            signal: this.abortController?.signal,
            cache: 'no-cache'
          });
          
          const data = await response.arrayBuffer();
          const endTime = performance.now();
          
          const durationSeconds = (endTime - startTime) / 1000;
          const speedMbps = (data.byteLength * 8) / (durationSeconds * 1000000);
          
          speeds.push(speedMbps);
          break;
        } catch {
          if (attempt === 2) {
            throw new Error('All download attempts failed');
          }
        }
      }
    }
    
    // Return the median speed for accuracy
    speeds.sort((a, b) => a - b);
    const median = speeds[Math.floor(speeds.length / 2)];
    return Math.round(median * 100) / 100;
  }

  async measureUploadSpeed(fileSizeKB: number): Promise<number> {
    // Create real test data
    const testData = new ArrayBuffer(fileSizeKB * 1024);
    const view = new Uint8Array(testData);
    
    // Fill with random data to simulate real upload
    for (let i = 0; i < view.length; i++) {
      view[i] = Math.floor(Math.random() * 256);
    }
    
    const speeds: number[] = [];
    
    for (let attempt = 0; attempt < 2; attempt++) {
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
        
        await response.text(); // Ensure full response is received
        const endTime = performance.now();
        
        const durationSeconds = (endTime - startTime) / 1000;
        const speedMbps = (testData.byteLength * 8) / (durationSeconds * 1000000);
        
        speeds.push(speedMbps);
        break;
        
      } catch (error) {
        console.log(`Upload attempt ${attempt + 1} failed`);
        
        if (attempt === 1) {
          // Try alternative upload endpoint
          try {
            const startTime = performance.now();
            
            const formData = new FormData();
            formData.append('file', new Blob([testData]), 'test.dat');
            
            const response = await fetch('https://httpbin.org/anything', {
              method: 'POST',
              body: formData,
              signal: this.abortController?.signal
            });
            
            await response.text();
            const endTime = performance.now();
            
            const durationSeconds = (endTime - startTime) / 1000;
            const speedMbps = (testData.byteLength * 8) / (durationSeconds * 1000000);
            
            speeds.push(speedMbps);
          } catch {
            throw new Error('All upload attempts failed');
          }
        }
      }
    }
    
    // Return the best speed result
    const maxSpeed = Math.max(...speeds);
    return Math.round(maxSpeed * 100) / 100;
  }

  async runFullTest(fileSizeKB: number, onProgress?: (step: string) => void): Promise<SpeedTestResult> {
    this.abortController = new AbortController();
    
    try {
      onProgress?.('Getting server info...');
      const serverInfo = await this.getServerInfo();
      
      onProgress?.('Measuring ping...');
      const ping = await this.measurePing();
      
      onProgress?.('Testing download speed...');
      const downloadSpeed = await this.measureDownloadSpeed(fileSizeKB);
      
      onProgress?.('Testing upload speed...');
      const uploadSpeed = await this.measureUploadSpeed(Math.min(fileSizeKB, 10240)); // Limit upload to 10MB max
      
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
