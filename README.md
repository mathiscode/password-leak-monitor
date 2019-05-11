# Password Leak Monitor

A browser addon that automatically monitors all passwords used and alerts you if it has been included in any data breaches.

## How is this safe?

Your passwords are **NEVER** transmitted to any other system. This addon makes use of the [Have I Been Pwned API](https://haveibeenpwned.com/API/), which implements a [k-Anonymity Model](https://en.wikipedia.org/wiki/K-anonymity) so your password can be checked without ever having to give your password to any other party.

## How does it work?

It's a fairly simple extension: for every password you enter, once the password field loses focus, a call is made to [Have I Been Pwned](https://haveibeenpwned.com/API/v2#PwnedPasswords) with the first five characters of your _hashed_ password. A list of potential matches is returned, and the extension determines if your hashed password matches any of the compromised hashes.
