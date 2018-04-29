# 🤖🤖Renos-Discord-TIPBot🤖🤖

## !wallet
!wallet help
!wallet deposit (or address)
!wallet balance
!wallet send <TO ADDRESS> <AMOUNT> (use as withdraw)

## !tip
!tip help
!tip <USERID> <AMOUNT>


# Install

```
apt-get install default-jre nodejs npm build-essential screen
git clone <url>
cd <dir>
npm install
```

Dev:
```
screen
npm install nodemon --global
npm run dev
```

Production:
```
screen
npm install forever --global
npm start

or

pm2 start App.js --watch
pm2 list
pm2 logs App
```

Stop:
```
forever list
forever stop <PID>
```


# License

Keep originals names and mentions in the code.


```
