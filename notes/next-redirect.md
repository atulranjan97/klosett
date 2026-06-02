# Next.js `redirect()` aur `isRedirectError()` — Detailed Notes

## 1. Sabse Pehle: `redirect()` kya karta hai?

Jab hum Next.js App Router mein `redirect()` use karte hain, to hume lagta hai ki ye function simply user ko ek route se doosre route par bhej deta hai. User ke perspective se exactly wahi hota hai. Lekin internally Next.js is behavior ko implement karne ke liye ek special technique use karta hai: **ye ek special error throw karta hai**.

Example:

```ts
import { redirect } from 'next/navigation';

redirect('/login');
```

Jab ye line execute hoti hai, function normal tareeke se return nahi karta. Iske bajay Next.js internally ek special redirect error throw karta hai.

Conceptually kuch aisa:

```ts
function redirect(url: string) {
  throw new RedirectError(url);
}
```

Actual Next.js source code exactly aisa nahi hai, lekin concept samajhne ke liye ye model useful hai.

---

## 2. `return` aur `throw` mein Difference

Bahut logon ko pehli baar confusion hoti hai ki agar function ko rokna hai to `return` kyon nahi use karte?

### `return`

```js
function test() {
  console.log("A");

  return;

  console.log("B");
}
```

Output:

```txt
A
```

Yahan `return` function ko normally finish karta hai aur caller ko control wapas de deta hai.

---

### `throw`

```js
function test() {
  console.log("A");

  throw new Error("Boom");

  console.log("B");
}
```

Output:

```txt
A
Error: Boom
```

Yahan function abruptly stop ho jata hai aur JavaScript runtime error ko nearest `catch` block tak bhejne ki koshish karta hai.

---

## 3. `return` sirf Current Function ko Rokta Hai

Example:

```js
function c() {
  return;
}

function b() {
  c();

  console.log("b continues");
}

b();
```

Output:

```txt
b continues
```

Yahan `c()` khatam hua lekin `b()` continue karta raha.

Isliye agar Next.js sirf `return` use karta, to redirect ke baad bhi rendering process continue ho sakti thi, jo galat hota.

---

## 4. `throw` Call Stack ko Unwind Karta Hai

Example:

```js
function c() {
  throw new Error("Boom");
}

function b() {
  c();

  console.log("b ke baad");
}

function a() {
  b();

  console.log("a ke baad");
}

a();
```

Flow:

```txt
a()
 ↓
b()
 ↓
c()
 ↓
throw Error
```

Jab error throw hota hai:

* `c()` turant stop
* `b()` turant stop
* `a()` turant stop

JavaScript nearest `catch` dhundhta hai.

Agar kahin catch nahi milta:

```txt
Uncaught Error: Boom
```

---

## 5. Error Catch Kaise Hota Hai?

```js
function c() {
  throw new Error("Boom");
}

function b() {
  c();
}

function a() {
  try {
    b();
  } catch (err) {
    console.log("Caught:", err.message);
  }
}

a();
```

Output:

```txt
Caught: Boom
```

Error stack ke through upar travel karta hai jab tak usse koi `catch` block na mil jaye.

---

## 6. Next.js `redirect()` Internally Kya Karta Hai?

Maan lo:

```ts
export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <Dashboard />;
}
```

Conceptual flow:

```txt
Page()
 ↓
redirect('/login')
 ↓
throw RedirectError
 ↓
Next.js catches it
 ↓
Redirect response generated
 ↓
Browser moves to /login
```

Yahan redirect error crash karne ke liye nahi hota.

Ye framework ko signal dene ke liye hota hai:

> "Current rendering process ko immediately stop karo aur redirect response bhejo."

---

## 7. `redirect()` ka Return Type `never` Kyon Hota Hai?

TypeScript mein Next.js redirect ka return type generally `never` hota hai.

Example:

```ts
declare function redirect(url: string): never;
```

`never` ka matlab:

> "Ye function kabhi normal tareeke se return nahi karega."

Example:

```ts
redirect('/login');

console.log("hello");
```

TypeScript jaanta hai ki `console.log()` tak execution kabhi nahi pahunch sakta.

Kyun?

Kyuki `redirect()` internally throw karta hai.

---

## 8. Problem: `try/catch` Redirect Ko Break Kar Sakta Hai

Example:

```ts
try {
  redirect('/login');
} catch (error) {
  console.log("Caught");
}
```

Kya hoga?

1. `redirect()` special error throw karega
2. `catch` usse pakad lega
3. Next.js tak redirect signal nahi pahunch payega

Result:

```txt
Redirect fail
```

User redirect nahi hoga.

---

## 9. `isRedirectError()` Kya Hai?

Isi problem ko solve karne ke liye Next.js internal helper provide karta hai:

```ts
import { isRedirectError } from 'next/dist/client/components/redirect-error';
```

Ye function check karta hai:

> "Kya jo error catch hua hai wo Next.js ka special redirect error hai?"

Example:

```ts
catch (error) {
  if (isRedirectError(error)) {
    throw error;
  }
}
```

Agar redirect error hai to usse wapas throw kar diya jata hai.

Taaki Next.js usse handle kar sake.

---

## 10. Real World Example

```ts
'use server';

import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export async function createPost() {
  try {
    await savePost();

    redirect('/posts');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    throw new Error('Failed to create post');
  }
}
```

Flow:

```txt
savePost()
 ↓
redirect('/posts')
 ↓
RedirectError thrown
 ↓
catch block
 ↓
isRedirectError() === true
 ↓
throw error again
 ↓
Next.js catches it
 ↓
Redirect happens
```

---

## 11. Better Pattern (Recommended)

Aksar best practice ye hoti hai ki `redirect()` ko `try/catch` ke bahar rakha jaye.

Instead of:

```ts
try {
  await createUser();

  redirect('/dashboard');
} catch (error) {
  // ...
}
```

Use:

```ts
await createUser();

redirect('/dashboard');
```

Ya:

```ts
try {
  await createUser();
} catch (error) {
  throw error;
}

redirect('/dashboard');
```

Isse redirect error ko manually handle karne ki zarurat hi nahi padti.

---

# Quick Revision Summary

* `redirect()` internally special redirect error throw karta hai.
* `return` sirf current function ko stop karta hai.
* `throw` call stack ko unwind karta hai aur nearest `catch` tak jata hai.
* Next.js redirect error ko catch karke HTTP redirect response banata hai.
* `redirect()` ka return type `never` hota hai.
* `try/catch` redirect error ko accidentally swallow kar sakta hai.
* `isRedirectError()` check karta hai ki caught error redirect wala special error hai ya nahi.
* Agar redirect error ho to usse dubara throw karna chahiye.
* Best practice: `redirect()` ko `try/catch` ke bahar rakhna jab possible ho.
