class Config {
    host: string
    port: string
    protocol: string

    url: string
    
    constructor() {
        this.host = process.env.REACT_APP_HOST || 'localhost';
        this.port = process.env.REACT_APP_PORT || '443';
        this.protocol = process.env.REACT_APP_PTCL || 'http';

        this.url = `${this.protocol}://${this.host}:${this.port}`;
    }
}

const config = new Config();

export default config;
