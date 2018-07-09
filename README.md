# Who Squares?

Dokumentation siehe Wiki.

## Start-Anleitung

1. Client-Javascript bauen:
   ```bash
    gulp js # einmalig; oder
    gulp default # watchen
    ```
2. MongoDB auf Standard-Port und Localhost starten.  
   Es gibt ein Docker-Compose Projekt dafür in `deployment/local`.  
   Oder weitere Infos im [Wiki](https://gitlab.informatik.haw-hamburg.de/wp-mbc-ss2018/who-squares/wikis/Datenbank). 
3. Server starten:
   ```bash
   cd src/server
   node --require ts-node/register server.ts
   ```
4. Browser aufrufen:  
   http://127.0.0.1:8080
5. 🎉

Alternativ können auch die Run-Configurations in Webstorm genutzt werden.