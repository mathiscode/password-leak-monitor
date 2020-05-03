<!-- markdownlint-disable MD001 -->
# Password Leak Monitor

[![Sponsor](https://img.shields.io/badge/Sponsor-my%20work-success)](https://github.com/sponsors/mathiscode)

[![Mozilla Add-on](https://img.shields.io/amo/v/password-leak-monitor.svg)](https://addons.mozilla.org/en-US/firefox/addon/password-leak-monitor)
[![Mozilla Add-on](https://img.shields.io/amo/users/password-leak-monitor.svg)](https://addons.mozilla.org/en-US/firefox/addon/password-leak-monitor)
[![Mozilla Add-on](https://img.shields.io/amo/dw/password-leak-monitor.svg)](https://addons.mozilla.org/en-US/firefox/addon/password-leak-monitor)
[![Mozilla Add-on](https://img.shields.io/amo/stars/password-leak-monitor)](https://addons.mozilla.org/en-US/firefox/addon/password-leak-monitor)

<!--
[![Beerpay](https://beerpay.io/mathiscode/password-leak-monitor/badge.svg?style=beer-square)](https://beerpay.io/mathiscode/password-leak-monitor)  [![Beerpay](https://beerpay.io/mathiscode/password-leak-monitor/make-wish.svg?style=flat-square)](https://beerpay.io/mathiscode/password-leak-monitor?focus=wish)
-->

[![Build Status](https://travis-ci.org/mathiscode/password-leak-monitor.svg?branch=master)](https://travis-ci.org/mathiscode/password-leak-monitor)
[![GitHub license](https://img.shields.io/github/license/mathiscode/password-leak-monitor.svg?color=blue)](https://github.com/mathiscode/password-leak-monitor/blob/master/LICENSE)
[![Standardjs](https://img.shields.io/badge/code_style-standard-blue.svg)](https://standardjs.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/mathiscode/password-leak-monitor/compare)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Make%20sure%20your%20passwords%20are%20safe&url=https://github.com/mathiscode/password-leak-monitor#readme&hashtags=firefox,chrome,passwords,security)

A browser addon that automatically monitors all passwords used and alerts you if it has been included in any data breaches.

### [Download for Firefox](https://addons.mozilla.org/en-US/firefox/addon/password-leak-monitor)

Also check out the [password-leak](https://github.com/mathiscode/password-leak) JavaScript library!

---

## How is this safe?

Your passwords are **NEVER** transmitted to any other system. This addon makes use of the [Have I Been Pwned API](https://haveibeenpwned.com/API/), which implements a [k-Anonymity Model](https://en.wikipedia.org/wiki/K-anonymity) so your password can be checked without ever having to give your password to any other party.

## How does it work?

It's a fairly simple extension: for every password you enter, a call is made to [Have I Been Pwned](https://haveibeenpwned.com/API/v2#PwnedPasswords) with the first five characters of your _hashed_ password. A list of potential matches is returned, and the addon determines if your hashed password matches any of the compromised hashes.
