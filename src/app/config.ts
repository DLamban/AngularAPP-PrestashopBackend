

export class ApiConfigSecret{
  public getConfig(){
    let secretConfig:any={
      apiKey: 'prestashop api key',
      apiEndPoint: 'http://thewebwhereistheapi',
      cookieKey: 'prestashop cookie key from config files'
    }
    return secretConfig;
  }
}
