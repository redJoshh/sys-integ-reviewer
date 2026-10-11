# LT1 – System Integration: Answer Key with Explanations

**1. Which Python command creates a conditional control structure?**

- [ ] from
- [ ] def
- [ ] delay
- [x] ✅ if

> **Explanation:** `if` (with `elif`/`else`) is how Python makes decisions. `from` is for imports, `def` defines a function, and `delay` isn't a Python keyword.

---

**2. `employees["9999"]` on `{"1001": "Engineering", "1002": "Marketing"}` without try-except crashes with a KeyError.**

- [x] ✅ True
- [ ] False

> **Explanation:** Looking up a key that doesn't exist with square brackets raises `KeyError`. Unhandled, the program terminates. (`.get("9999")` would return `None` instead.)

---

**3. What does `apt-get upgrade` do?**

- [ ] Operating system updates are downloaded and will be installed.
- [x] ✅ Every application installed on the system will update itself to the latest version.
- [] Operating system updates are downloaded and will be installed. _(duplicate of the first option in the source file)_
- [ ] The remote repository of applications and dependencies will be updated to the latest version.

> **Explanation:** `apt-get upgrade` downloads and installs newer versions of already-installed packages. Refreshing the repository list is the job of `apt-get update`. It doesn't "make every application update itself," and it won't remove or add new packages. _(Note: this option appears twice in your file; either copy is the correct one.)_

---

**4. Which statements about exception handling in Python are correct? (Select all that apply)**

- [x] ✅ All exceptions in Python are represented as objects.
- [x] ✅ The code inside a `finally` block executes upon completion regardless of whether an exception occurred or was handled.
- [x] ✅ Executing `int()` on a non-numeric string like "Two Thousand" raises a `ValueError`.
- [x] ✅ Custom exception classes are created in Python by inheriting from the base `Exception` class.
- [ ] Catching `ZeroDivisionError` automatically catches `FileNotFoundError` because all standard exceptions belong to a single flat list without a hierarchy.

> **Explanation:** The first four are true. The last is false: Python exceptions form a **hierarchy** (e.g., `ZeroDivisionError` → `ArithmeticError` → `Exception`), and `ZeroDivisionError` and `FileNotFoundError` are unrelated siblings, so catching one does not catch the other.

---

**5. What is displayed?**

```py
addition = 22 + 10
print(addition)
```

- [ ] [ [22] + [10] ]
- [ ] (syntaxerror)...
- [x] ✅ 32
- [ ] nothing

> **Explanation:** `22 + 10 = 32`, stored in `addition`, and `print()` outputs it. The code is syntactically valid.

---

**6. What does the `ps` command mainly display?**

- [x] ✅ Active processes using CPU time.
- [ ] Current RAM usage.
- [ ] Current HDD usage.
- [ ] Current NIC status.

> **Explanation:** `ps` ("process status") lists running processes. RAM is checked with `free`, disk with `df`/`du`, and NIC status with `ip`/`ifconfig`.

---

**7. Import only `randint` from `random` and alias it as `random_num`.**

- [ ] `import random.randint as random_num`
- [x] ✅ `from random import randint as random_num`
- [ ] `import randint as random_num from random`
- [ ] `from random import random_num as randint`

> **Explanation:** The syntax is `from <module> import <name> as <alias>`. The other options have invalid syntax or reverse the name and alias.

---

**8. The `finally` block executes regardless of whether an exception occurred or was handled.**

- [x] ✅ True
- [ ] False

> **Explanation:** `finally` always runs after `try`/`except`, which makes it ideal for cleanup such as closing files or connections.

---

**9. Which statements about strings and lists in Python are accurate? (Select all that apply)**

- [x] ✅ Calling `.split(",")` on a comma-separated string returns a list of substrings.
- [x] ✅ The `.join()` string method combines elements of a list into a single delimited string.
- [x] ✅ Both strings and lists are iterable sequences in Python.
- [ ] Individual characters in a string can be modified directly in place using index assignment (e.g., `text[0] = "a"`).
- [x] ✅ Lists can be changed in place because they are mutable, whereas strings are immutable.

> **Explanation:** Strings are **immutable**, so `text[0] = "a"` raises `TypeError`. You must build a new string instead. The other four statements are all true.

---

**10. `./myfile.sh` gives "Permission denied"; `chmod +x myfile.sh` grants execute permission.**

- [x] ✅ True
- [ ] False

> **Explanation:** The file lacks the execute (`x`) bit. `chmod +x` adds it so the script can be run.

---

**11. Terminal says you lack permissions to configure the NIC. What should be done prior to the command?**

- [x] ✅ use the `sudo` command
- [ ] identify a different network interface
- [ ] change the chmod permissions on the network configuration file
- [ ] use a different user account

> **Explanation:** Network configuration requires elevated (root) privileges. Prefixing the command with `sudo` runs it with those privileges.

---

**12. `minutes = total_minutes % 60` with 130 minutes evaluates to 10.**

- [x] ✅ True
- [ ] False

> **Explanation:** `%` returns the remainder. 130 ÷ 60 = 2 remainder **10**.

---

**13. Which command returns lines **ending** with `false`?**

- [ ] `grep 'f..se' /etc/passwd`
- [x] ✅ `grep 'false$' /etc/passwd`
- [ ] `grep '[false]' /etc/passwd`
- [ ] `grep '^false' /etc/passwd`

> **Explanation:** `$` anchors a match to the end of a line. `^` anchors to the start; `[false]` matches any single character in the set; `f..se` matches any 5-character pattern like that anywhere.

---

**14. `hours = total_minutes // 60` with `total_minutes = 130`. What is stored?**

- [ ] 2.1666666666666665
- [x] ✅ 2
- [ ] 10
- [ ] 2.17

> **Explanation:** `//` is floor division and discards the fractional part: 130 // 60 = 2. (2.1666… would be the result of regular `/`; 10 is the `%` result.)

---

**15. Turn `"apple,banana,cherry"` into `"apple & banana & cherry"`.**

- [ ] `fruits = csv_data.strip(",")` then `" & ".capitalize(fruits)`
- [ ] `fruits = csv_data.join(",")` then `" & ".split(fruits)`
- [ ] `fruits = csv_data.replace(",")` then `" & ".append(fruits)`
- [x] ✅ `fruits = csv_data.split(",")` then `" & ".join(fruits)`

> **Explanation:** `split(",")` turns the string into a list; `" & ".join(list)` glues the list items with the chosen separator. The other options misuse the methods.

---

**16. Score = 85 with the if/elif chain. What prints?**

````python
score = 85
if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")
```[cite: 6]
````

- [x] ✅ Grade: B
- [ ] Grade: F
- [ ] Grade: C
- [ ] Grade: A

> **Explanation:** `85 >= 90` is False, then `85 >= 80` is True, so "Grade: B" prints and the remaining branches are skipped.

---

**17. Find `taylor` at the **beginning** of a line in `/etc/passwd`.**

- [ ] `grep '.taylor' /etc/passwd`
- [ ] `grep '[taylor]' /etc/passwd`
- [x] ✅ `grep '^taylor' /etc/passwd`
- [ ] `grep taylor /etc/passwd`

> **Explanation:** `^` anchors the match to the start of the line. Plain `grep taylor` matches anywhere in the line.

---

**18. When is the `elif` evaluated?**

- [ ] when the input is a float number
- [x] ✅ when the `if` statement is false.
- [ ] when the first print statement fails
- [ ] when the input is a string

> **Explanation:** An `elif` is only checked if the preceding `if` condition evaluated to False. (A float or non-numeric string would actually raise an error at `int(input(...))` before any `if` runs.)

---

**19. Which Python function displays output?**

- [ ] for
- [ ] if
- [x] ✅ print
- [ ] while

> **Explanation:** `print()` outputs to the screen. `for`/`while` are loops and `if` is a conditional.

---

**20. How does the system process a Python source file when run?**

- [x] ✅ It translates and runs the source code line-by-line at runtime.
- [ ] It compiles all source code into machine code prior to execution.
- [ ] It converts the code directly into natural human language.
- [ ] It sends the raw text directly to the CPU without translation.

> **Explanation:** Python is an **interpreted** language: the interpreter translates and executes code at runtime. (CPython does produce bytecode internally, but the expected textbook answer is line-by-line interpretation, not ahead-of-time machine code compilation.)

---

**21. `hours = total_minutes // 60` with 130 minutes evaluates to `2.1666666666666665`.**

- [ ] True
- [x] ✅ False

> **Explanation:** `//` is floor division, so the result is `2`. The value 2.1666… comes from `/`.

---

**22. `delivery_manifest[-1]` for `["part_101", "part_240", "part_330", "part_999"]`**

- [ ] "part_240"
- [ ] IndexError
- [ ] "part_101"
- [x] ✅ "part_999"

> **Explanation:** Index `-1` refers to the last element of a list.

---

**23. Permission error when configuring the NIC. Best immediate action?**

- [ ] Use a different user account.
- [ ] Identify a different network interface.
- [x] ✅ Use the sudo command.
- [ ] Change the chmod permissions on the network configuration file.

> **Explanation:** Same as Q11. `sudo` temporarily elevates privileges for administrative tasks.

---

**24. What is the purpose of `apt-get upgrade`?**

- [x] ✅ Operating system updates are downloaded and will be installed.
- [ ] A specific application named upgrade will be installed.
- [ ] The remote repository of applications and dependencies will be updated to the latest version.
- [ ] Every application installed will update itself to the latest version.

> **Explanation:** It downloads and installs available updates for installed packages. Updating the repository index is `apt-get update`, and `upgrade` is a subcommand, not an application name.

---

**25. Which statements about modules, packages, and package management are correct? (Select all that apply)**

- [x] ✅ A collection of modules organized in a directory structure marked by an `__init__.py` file constitutes a package.
- [ ] Importing a function automatically converts a single module file into a directory package.
- [x] ✅ Executing `from random import randint as random_num` imports a specific function and assigns it an alias.
- [x] ✅ PIP serves as the standard package manager that connects to the Python Package Index (PyPI) to install external libraries.
- [x] ✅ A single file containing Python code functions as a module.

> **Explanation:** Importing never changes how files are structured on disk, so the second statement is false. The others accurately describe packages, aliased imports, pip/PyPI, and modules.

---

**26. `fruits[1:4]` on `["apple", "banana", "cherry", "date", "elderberry"]` returns `["banana", "cherry", "date"]`.**

- [x] ✅ True
- [ ] False

> **Explanation:** Slices include the start index (1) and exclude the end index (4), giving indexes 1, 2, 3.

---

**27. Which command checks the Python version?**

- [ ] `python3 -v`
- [x] ✅ `python3 -V`
- [ ] `python3 -q`
- [ ] `python3 -i`

> **Explanation:** Capital `-V` prints the version. Lowercase `-v` enables verbose mode, `-q` suppresses the startup banner, and `-i` enters interactive mode after running a script.

---

**28. `apt-get upgrade` returns "permission denied." What should the user do?**

- [x] ✅ Issue the `sudo apt-get upgrade` command.
- [ ] Issue the `sudo apt-get install` command.
- [ ] Issue the `apt-get install -allow` command.
- [ ] Issue the `allow apt-get upgrade` command.

> **Explanation:** Package management needs root privileges, so rerun the same command with `sudo`. The other commands do different things or don't exist.

---

**29. `echo "I LOVE Linux!" > linux2.txt` appends to the file without overwriting.**

- [ ] True
- [x] ✅ False

> **Explanation:** `>` **overwrites** the file. To append, use `>>`.

---

**30. Which Python feature uses `yield` for lazy, on-the-fly values?**

- [x] ✅ Generators
- [ ] Context managers
- [ ] Exception hierarchies
- [ ] Packages

> **Explanation:** Functions containing `yield` are generators; they produce values one at a time instead of building the whole sequence in memory.

---

**31. Which statements about Linux administrative utilities are correct? (Select all that apply)**

- [x] ✅ Piping output to `| more` (e.g., `ps -e | more`) allows page-by-page viewing where Spacebar advances one screen and Enter advances one line.
- [x] ✅ Executing `shutdown -c` cancels a previously scheduled delayed system shutdown.
- [x] ✅ Executing `ps` displays only the processes running in the current terminal session.
- [x] ✅ Executing `ps -ef` lists all running processes formatted with columns showing User ID (UID), Process ID (PID), and Parent Process ID (PPID).

> **Explanation:** All four are accurate. `more` pages output, `shutdown -c` cancels a pending shutdown, plain `ps` shows only the current shell's processes, and `ps -ef` shows every process in full format including UID, PID, and PPID.

---

**32. Which command cancels a scheduled shutdown?**

- [ ] `shutdown now`
- [ ] `sudo apt-get purge shutdown`
- [ ] `ps -ef | shutdown`
- [x] ✅ `shutdown -c`

> **Explanation:** `-c` cancels a pending shutdown. `shutdown now` would do the opposite, and the others are nonsensical or destructive.

---

**33. Why does `grep 'new*' /etc/passwd` match lines containing `nonexistent` as well as `news`?**

- [ ] The character acts as a wildcard matching any word that starts with the letter 'n'.
- [x] ✅ The repetition operator matches zero or more occurrences of the preceding character (w), matching ne followed by zero w's.
- [ ] The single quotation marks convert new into an unrestricted search range.
- [ ] The grep tool automatically ignores vowels when searching system configuration files.

> **Explanation:** In regex, `*` applies only to the character right before it (`w`). So `new*` means `ne` followed by zero or more `w`s, and "nonexistent" contains "ne" (in "existent"), which matches.

---

**34. Which command produced the long listing shown (permissions, owner, size, date)?**

- [ ] `ls -a`
- [ ] `ls`
- [ ] `ls -lr`
- [x] ✅ `ls -l`

> **Explanation:** `-l` gives the long format. The output is in alphabetical order, so it's not reversed (`-r` would reverse it), and no hidden files (dotfiles) appear, so it isn't `-a`.

---

**35. print(fruits[1:4])` displays:**

```python
`fruits = ["apple", "banana", "cherry", "date", "elderberry"]`
```

- [ ] `["apple", "elderberry"]`
- [ ] `["banana", "cherry", "date", "elderberry"]`
- [x] ✅ `["banana", "cherry", "date"]`
- [ ] `["apple", "banana", "cherry"]`

> **Explanation:** Index 1 to 3 (end index 4 excluded) gives banana, cherry, date.

---

**36. `logs[-1]` retrieves the last item in the list.**

- [x] ✅ True
- [ ] False

> **Explanation:** Negative indexes count from the end; `-1` is the last element.

---

**37. Which command displayed `-rwxr-xr-- 1 self test 15 Mar 30 21:24 myfile.sh`?**

- [ ] `ls -lr`
- [x] ✅ `ls -l`
- [ ] `ls -a`
- [ ] `ls`

> **Explanation:** The listing is in long format, which is `ls -l`. Here it was run as `ls -l myfile.sh`.

---

**38. Find usernames that **start with a digit** in `/etc/passwd`.**

- [ ] `grep '[0-9]*' /etc/passwd`
- [ ] `grep '[0-9]' /etc/passwd`
- [x] ✅ `grep '^[0-9]' /etc/passwd`
- [ ] `grep '_[0-9]' /etc/passwd`

> **Explanation:** `^` anchors to line start and `[0-9]` matches a digit. `[0-9]*` matches every line (zero or more digits), and `[0-9]` alone matches a digit anywhere in the line.

---

**39. An application prompts a user for their birth year. If the user enters string text like "Two Thousand", executing int(user_input) raises an error. Which specific except block should be used to catch this invalid string-to-integer conversion? ?**

- [ ] `except TypeError:`
- [ ] `except FileNotFoundError:`
- [x] ✅ `except ValueError:`
- [ ] `except ZeroDivisionError:`

> **Explanation:** `int()` receives a valid type (string) but an invalid _value_, which raises `ValueError`. `TypeError` is for wrong types (e.g., `int(None)`).

---

**40. A directory of modules with an `__init__.py` file constitutes a package.**

- [x] ✅ True
- [ ] False

> **Explanation:** This is the traditional definition of a Python package. (Modern Python also allows namespace packages without it, but the expected answer here is True.)

---

**41. Find `/etc/passwd` entries whose username begins with a digit.**

- [ ] `grep '_[0-9]' /etc/passwd`
- [x] ✅ `grep '^[0-9]' /etc/passwd`
- [ ] `grep '[0-9]*' /etc/passwd`
- [ ] `grep '[0-9]' /etc/passwd`

> **Explanation:** Same as Q38: `^[0-9]` = "line starts with a digit."

---

**42. `text[0] = "j"` works because strings and lists share identical in-place mutability.**

- [ ] True
- [x] ✅ False

> **Explanation:** Strings are immutable, so this raises `TypeError: 'str' object does not support item assignment`. Lists are mutable, but strings are not.
