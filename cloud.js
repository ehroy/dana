const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth")();
[("chrome.runtime", "navigator.languages")].forEach((a) =>
  stealthPlugin.enabledEvasions.delete(a)
);
const fs = require("fs-extra");
puppeteer.use(stealthPlugin);
const chalk = require("chalk");
const SMSActivate = require("./lib/index");
var sleep = require("delay");

(async () => {
  const pin = "112233";
  const apikey = "";
  let browser;
  let sms;
  while (true) {
    try {
      sms = new SMSActivate(apikey, "smshub");
      const balance = await sms.getBalance();
      console.log(
        chalk.yellowBright(`[ INFO ] `) +
          chalk.greenBright(`Saldo SMSHUB ${balance} руб`)
      );

      let data;
      try {
        do {
          data = await sms.getNumber("fr", 6, "axis");
        } while (data === null);
      } catch (err) {
        console.log(
          chalk.yellowBright(`[ INFO ] `) +
            chalk.redBright(`Gagal Mendapatkan Nomer ${err}`)
        );
        await sleep(5000);
        continue;
      }
      var { id, number } = data;
      await sms.setStatus(id, 1);
      console.log(
        chalk.yellowBright(`[ INFO ] `) +
          chalk.greenBright(`Try To Create With Number [ ${number} ]`)
      );
      browser = await puppeteer.launch({
        ignoreDefaultArgs: ["--enable-automation"],
        userDataDir: "dana",
        headless: false,
        devtools: false,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-infobars",
          "--window-position=0,0",
          "--ignore-certifcate-errors",
          "--ignore-certifcate-errors-spki-list",
          "--disable-blink-features=AutomationControlled",
          "--disable-extensions",
          "--disable-background-networking",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-breakpad",
          "--disable-client-side-phishing-detection",
          "--disable-default-apps",
          "--disable-dev-shm-usage",
          "--disable-features=site-per-process",
          "--disable-hang-monitor",
          "--disable-ipc-flooding-protection",
          "--disable-popup-blocking",
          "--disable-prompt-on-repost",
          "--disable-renderer-backgrounding",
          "--disable-sync",
          "--disable-translate",
          "--enable-automation",
          "--metrics-recording-only",
          "--mute-audio",
          "--no-first-run",
          "--password-store=basic",
          "--use-mock-keychain",
          "--disable-gpu",
          "--incognito",
        ],
      });

      const time = { visible: true, timeout: 0 };
      const pages = await browser.pages();
      const page = pages[0];
      await page.goto(
        "https://m.dana.id/d/portal/oauth?acqSiteId=1022188000000000001&bindDanaType=gn&clientId=305XSM22SG0ASM05&mcc=7829&merchantEngName=iQIYI&merchantId=2188120002160083&merchantName=IQIYI&netAuthId=2022053019074400000520003395710&paySiteId=1022166000000000001&redirectUrl=https%3A%2F%2Fpay.iq.com%2Fpay-product-international%2Falipayams%2FauthResult%3Flocal_lang%3Did_id%26paymentRequestId%3D2022053095000168090%26sign%3Dc8b10822c13fcdda53b4e26cf8a56566&scopes=AGREEMENT_PAY&state=2022053095000168090&terminalType=APP&signature=I7BRjXIzP3udyJAKw9p45zuJah%2Bn%2B2tCBwEGAK1GTxWLBYPvdC9xalXORQTx2bKJehu%2BMv5lVHKLbU2iTNRqE2poV8Ul6Rqoszr%2B98R13YULvhilNFo8eL2NvBUNPEq6cqS1qbD0Prun%2FVPdvfwKSXF6SE9gC12Y3POMsmP2aXNW2op3%2BkL7gD3ymIADs%2FvPhN1RSxOIku08hyho0RKf193Y1ehnPFk1IwxuBtTk1ga0vLvBGlu%2Fm9UIpSrhWUAldUMNzkaxCuPY0WyxAEMyzrYmVrsLbUPOIH6xmd66ERE6ARSBMx60GEjX%2BqDMKSKl3EqQG5x5ZTPk8IASCtkveQ%3D%3D&_branch_match_id=1317667870160847986&_branch_referrer=H4sIAAAAAAAAA22S246iQBCGn0buxumDtLCJ2aCiwyiI4HFvJi200iNnGkSffhs3O7ubLGkS4P%2Br6qsqIiHy6tvra8zTaz%2BkKe3z8PXE0%2FA7DQqfC2aFIwgQgpoG%2FlxQ6SxTad%2Fccza6pEoQc5YKacZAPfg2Qv4cGL4NVCUJgtFQQ7qSsDKIaCrM9OLQhI342jpaX19laFcEIpkeQQKAhr%2B0p9162lMmjFpEnVtSARUDqIPhYPDEUrtgjHV1CIGS0%2Fvf%2FIT8w1%2BykJcsENsyHkXdDHrY6KGZPDKuz4t%2BkCW%2FXl7yMgvrQLzwVLAypYJnKY2lRmMuZZpU3bNk8lhVx6KHZ3EW0Pgjpumlh6c8%2FOBhDxFpTeSEPFbUrJLdSul3B7raIREN6EAaK35JpRhoJwg0hAKIz0EYUhWfBgyR4KxRlaiEKFWQ5awaGXPPNG3T2Xy4xlGpBBVs9J%2FEimRPuAR%2FLsxwXaWrQ0VdyskOx97nwXq4uA7v78bipucD9VG%2F06iHxqm8kZiMb%2BbcWMD5pt0vx0e3CSd6S%2BPDyltvWnRavLOolka7UePd22J52iK%2BcbzCRHm207Yx8YqsepTSoWsexMftsol47MwyjS2R04y3jmsWRP5wsDhNgVvWsups54bN%2BbbwDzPim%2FplAtERuyu7SlxED84eZTmWCa%2FL4WWK74llTLtFNG7kQM9vV9a1Blp0jzLgLc5Qx0fIotSdXaF1a%2Bux2FzhhYJm2YznsSSfJfrWyv0y2m%2BNONzazuNK20ntHsH%2B3hqmfX%2BUx2RXVrIzd2W9kTYJCTE9kxieP7ZbAubm50HSFFN74S9ibBbrudqqPzbuVbMMfyKuDVvLrcrzEyFONu1yAwAA",
        {
          waitUntil: "networkidle2",
          timeout: 0,
        }
      );

      await page.waitForSelector(
        "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div.card-agreement > main > div.agreement__phone-wrapper > div.input-phone-wrapper > div.input-phone-container > label.clearable-input.desktop-input > input",
        time
      );
      await page.type(
        "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div.card-agreement > main > div.agreement__phone-wrapper > div.input-phone-wrapper > div.input-phone-container > label.clearable-input.desktop-input > input",
        "8" + number.toString().split("628")[1]
      );
      await sleep(3000);
      await page.waitForSelector(
        "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div.card-agreement > main > div.agreement__button > button",
        time
      );
      await page.click(
        "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div.card-agreement > main > div.agreement__button > button"
      );
      try {
        await page.waitForSelector(
          "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div:nth-child(7) > div.f-dialog.wrapper--desktop > div.f-dialog__container > div > div > div.f-card__content.unregistered-number > div.unregistered-number__title",
          { visible: true, timeout: 10000 }
        );
        const text = await page.evaluate(
          () =>
            document.querySelectorAll(
              "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div:nth-child(7) > div.f-dialog.wrapper--desktop > div.f-dialog__container > div > div > div.f-card__content.unregistered-number > div.unregistered-number__title"
            )[0].innerText
        );
        console.log(chalk.yellowBright(`[ INFO ] `) + chalk.greenBright(text));
        await page.waitForSelector(
          "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div:nth-child(7) > div.f-dialog.wrapper--desktop > div.f-dialog__container > div > div > div.f-card__actions.unregistered-number__action > button.btn-register-pop-up.f-btn.f-btn-primary.f-btn-large"
        );
        await page.click(
          "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div:nth-child(7) > div.f-dialog.wrapper--desktop > div.f-dialog__container > div > div > div.f-card__actions.unregistered-number__action > button.btn-register-pop-up.f-btn.f-btn-primary.f-btn-large"
        );
        await sleep(63000);
        console.log(
          chalk.yellowBright(`[ INFO ] `) +
            chalk.greenBright("Done Sleep 60 Sec")
        );

        await page.waitForSelector(
          "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div.card-agreement > main > div > div > div.risk-otp-footer > button:nth-child(1)"
        );
        await page.evaluate(() => {
          document
            .querySelectorAll(
              "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div.card-agreement > main > div > div > div.risk-otp-footer > button:nth-child(1)"
            )[0]
            .click();
        });

        let otpCode;
        let count = 0;
        do {
          otpCode = await sms.getCode(id);
          // console.log(otpCode);
          if (count === 60) {
            await sms.setStatus(id, 8);
          }
          await sleep(1000);
          count++;
          // console.log(otpCode);
        } while (otpCode === "STATUS_WAIT_CODE");
        if (otpCode === "STATUS_CANCEL") {
          console.log(
            chalk.yellowBright(`[ INFO ] `) +
              chalk.redBright("Cancel Phone Number")
          );
          continue;
        } else {
          const otp = otpCode.replace(/[^0-9]+/g, "").slice(0,4);
          console.log(
            chalk.yellowBright(`[ INFO ] `) +
              chalk.greenBright("SMS OTP : " + otp)
          );
        }
        await sleep(1000);
        await page.waitForSelector(
          "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div.card-agreement > main > div > div > div.risk-otp-content.text-center > div > div > div:nth-child(1)"
        );
        await page.type(
          "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div.card-agreement > main > div > div > div.risk-otp-content.text-center > div > div > div:nth-child(1)",
          otpCode.replace(/[^0-9]+/g, "").slice(0,4)
        );
        await sleep(1000);
        await page.waitForSelector(
          "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div.card-agreement > main > div > div:nth-child(3) > div.input-pin__input-wrapper > input"
        );
        await page.type(
          "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div.card-agreement > main > div > div:nth-child(3) > div.input-pin__input-wrapper > input",
          pin
        );
        await sleep(2000);
        await page.waitForSelector(
          "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div.card-agreement > main > div > div:nth-child(5) > div.input-pin__input-wrapper > input"
        );
        await page.type(
          "#app > div > div > div.ipg-new__wrapper > div.ipg-new__content > div > div.card-agreement > main > div > div:nth-child(5) > div.input-pin__input-wrapper > input",
          pin
        );
        await sleep(5000);
        let final;
        do {
          final = await page.url();
          await sleep(2000);
        } while (final.includes("dana"));
        fs.appendFileSync("acountdana.txt", `${number}|${pin}\n`);
      } catch (error) {
        console.log(
          chalk.yellowBright(`[ INFO ] `) +
            chalk.redBright("Dana Mungkin Sudah Terdaftar")
        );
        await sms.setStatus(id, 8);
      }
    } catch (error) {
      await sms.setStatus(id, 8);
    }
    await browser.close();
    await sleep(2000);
    await fs.remove("dana");
    // await process.exit(0);
    console.log("");
  }
})();
