---
id: 73
title: 'Deep, Strict Equality Comparison of Native Types in JavaScript'
date: '2012-01-05T16:56:35-08:00'
author: 'Daniel Buchner'
layout: post
guid: 'https://www.backalleycoder.com/?p=73'
permalink: /2012/01/05/deep-strict-equality-comparison-of-native-types-in-javascript/
image:
    - ''
embed:
    - 'This is the default text'
seo_follow:
    - 'false'
seo_noindex:
    - 'false'
dsq_thread_id:
    - '527875460'
categories:
    - JavaScript
---

## The Why

 My buddy and I have been working on a web app and he recently needed a way to compare and ensure that two JS native instances were of the same type and that they were strictly equal (`===` vs a loose equality check, `==`). After you do the basic check to ensure that the two natives are of the same type, checking strict equality is a piece of cake for some types like `Number`, `String`, and `Boolean`. The interesting checks come when dealing with the other types though. The code is worth a thousand posts in this case, so let's cut to the chase: ## The Code

 *If you are unfamiliar with things like `typeOf`, `Array.from`, and `Object.extend` - (THIS DOES NOT EXTEND THE PROTOTYPE OF OBJECT), that's OK because those are little helpers provided by the awesome MooTools JS framework which I contribute to ;)* ```

Object.extend({
  'equals': function(first, second){
    if (first !== second){
      var type = typeOf(first),
          every = Array.every;
      if (type != typeOf(second)) return false;
      switch (type){
        case 'string': case 'regexp': return String(first) == String(second);
        case 'date': return first.getTime() == second.getTime();
        case 'arguments':
          first = Array.from(first);
          second = Array.from(second);
        case 'object': every = Object.every;
        case 'array': case 'object': case 'arguments':
          if (Object.getLength(first) != Object.getLength(second)) return false;
          return every(first, function(value, i){
            return (i in second) && Object.equals(value, second[i]);
          });
      }
    }
    else return true;
  }
});
```

### Step 1: Type checking

 In this code block, I first start by type checking with MooTools' `typeOf`, this helper is a bit better than the native `typeof` because it distinguishes between arrays, arguments objects, and DOM collections (also node lists), as well as a few other type-check oddities. ### Step 2: Use the right equality check

 Once I know both types are the same, we throw that into a switch to sift it into the right equality check case. You'll notice there are very different methods employed to ascertain equality depending on the type you're dealing with. ### Step 3: Some checks are easier than others...

 As stated above, numbers, strings, and booleans are all easy to check, so we knock them out in one case. Next up is `Regexp`, if you just compare them strait-up, two regexp objects will always report false, even if their regexp matching characters are identical. The best way there is to use `toString` on each to compare the actual matching characters. Next is Date. I chose not to use toString to compare date objects because the output is a low resolution time that only goes to minutes. To know two dates are exactly the same, instead I use getTime(), which gives me millisecond precision. Lastly are Array and Object. These two are not too much harder, they just require iterating the array or walking the object, then using the Object.equals method recursively on the values descending to the full depth of the instance. ## What about `Function` equality?

 Due to the nature of the need, and the nearly impossible task of ensuring functional equality on unnamed and non-cached functions, this was not a concern for me and is not likely a concern for the broad range of use-cases. Hope this helps, enjoy! *(If you see any errors or I missed a type you think should be included, let me know in the comments!)* 