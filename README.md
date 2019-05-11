# Password Leak Monitor

A browser addon that automatically monitors all passwords used and alerts you if it has been included in any data breaches.

## How is this safe?

Your passwords are **NEVER** transmitted to any other system. This addon makes use of the haveibeenpwned API, which implements a [k-Anonymity Model](https://en.wikipedia.org/wiki/K-anonymity) so your password can be checked without ever having to give your password to any other party.
