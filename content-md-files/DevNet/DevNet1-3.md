# DevNet Associate (Version 1.0) - Module 1: Course Introduction

**1. A system administrator issues the `apt-get upgrade` command on a Linux operating system. What is the purpose of this command?**

- [ ] The remote repository of applications and dependencies will be updated to the latest version.
- [x] ✅ Every application installed will update itself to the latest version.
- [ ] Operating system updates are downloaded and will be installed.
- [ ] A specific application named upgrade will be installed.

> **Explanation:** When the `apt-get upgrade` command is issued in a Linux terminal, all installed applications will attempt to upgrade to the latest version available. (Note: `apt-get update` is used to update the remote repository lists).

**2. A network engineer needs to review the status of all network interfaces of a server running a Linux operating system. The engineer enters the command `ifconfig -a`. What is the result of this command?**

- [ ] All active interfaces will display information.
- [x] ✅ Both active and inactive interfaces will display information.
- [ ] The ARP table of the computer will be displayed.
- [ ] The host routing table will be displayed.

> **Explanation:** The `ifconfig` command with the `-a` modifier will provide information for all network interfaces, even if they are down (inactive).

**3. A system administrator attempts to determine what is causing a computer to perform slower than normal. The administrator issues the `ps` command. What is displayed by this command?**

- [ ] current RAM usage
- [ ] current HDD usage
- [ ] current NIC status
- [x] ✅ active processes using CPU time

> **Explanation:** The `ps` command can be combined with multiple modifiers to display all processes running on a computer, view a specific process, or end processes that are using CPU time.

**4. A Linux administrator is attempting to use a terminal to configure the network interface card on a computer. The administrator receives a message that the administrator does not have necessary permissions to perform the configuration. What should be done prior to the configuration command?**

- [ ] use a different user account
- [x] ✅ use the `sudo` command
- [ ] identify a different network interface
- [ ] change the `chmod` permissions on the network configuration file

> **Explanation:** Multiple terminal commands require the use of the `sudo` command as a preface. The command `sudo` means "super user do" and will require an administrator password to complete a configuration.

**5. A user issues a Linux command and the result is shown:**

```text
total 40
drwxr-xr-x 2 devasc devasc 4096 Mar 30 21:25 Desktop
drwxr-xr-x 2 devasc devasc 4096 Apr 15 19:09 Documents
...
```

**Which Linux command is used to display the contents of the current directory as shown?**

- [ ] `ls`
- [x] ✅ `ls -l`
- [ ] `ls -a`
- [ ] `ls -lr`

> **Explanation:** The Linux `ls` command with the `-l` option is used to display contents in the current directory with a "long list", which provides more information about each file or subdirectory, such as permissions, owner, size, and creation date.

**6. A user issues a series of Linux commands as shown:**

```text
(omitted)$ pwd
/home/devasc/labs/ansible/backups
(omitted)$ cd ../..
```

**Which directory is the current directory after the `cd` command is entered?**

- [ ] `/`
- [ ] `/home`
- [ ] `/home/devasc/`
- [x] ✅ `/home/devasc/labs`
- [ ] `/home/devasc/labs/ansible`

> **Explanation:** The `cd` command with the `..` option moves up a single directory. Using `../..` moves back two directories in the structure. From `/backups`, going up once reaches `/ansible`, and going up again reaches `/labs`.

**7. A user issues the Linux command `ls -l myfile.sh` to check the permission of the file:**

```text
-rwxr-xr-- 1 self test 15 Mar 30 21:24 myfile.sh
```

**Which two statements describe the permissions assigned to the file? (Choose two.)**

- [ ] All users can execute the file.
- [x] ✅ The user with the user ID of self can modify the file.
- [ ] The user with the user ID of devasc can modify the file.
- [x] ✅ Any user in the test group can execute the file.
- [ ] Any user in the self group can read, modify, and execute the file.

> **Explanation:** The first three letters (`rwx`) represent the owner (`self`), who can read, write (modify), and execute. The next three (`r-x`) represent the group (`test`), who can read and execute. The last three (`r--`) represent others, who can only read.

**8. A Linux system administrator is searching the passwd file for any username that starts with a digit. Which `grep` command should the administrator use?**

- [ ] `grep '{0-9}' /etc/passwd`
- [ ] `grep '[0-9]' /etc/passwd`
- [x] ✅ `grep '^[0-9]' /etc/passwd`
- [ ] `grep '_[0-9]' /etc/passwd`

> **Explanation:** The `^` (caret) regex modifier indicates the start of a string. `[0-9]` matches any single digit. Therefore, `^[0-9]` matches any line that starts with a digit.

**9. A user enters the commands as shown. What is the result after the `mv` command is entered?**

```text
devasc@labvm:~/Documents$ pwd
/home/devasc/Documents
devasc@labvm:~/Documents$ mv myfile.sh ../Desktop/myfile2.sh
```

- [ ] The file myfile.sh is copied and renamed to myfile2.sh in the current directory.
- [ ] The file myfile.sh is copied to the /home/devasc/Desktop directory and renamed as myfile2.sh.
- [x] ✅ The file myfile.sh is moved to the /home/devasc/Desktop directory and renamed as myfile2.sh.
- [ ] The file myfile.sh is copied to the /home/devasc/Desktop directory and replaces the file myfile2.sh.

> **Explanation:** The `mv` command is used to move a file to a different directory or rename it. Because the destination filename is different, the file is renamed after it is moved.

**10. Which Python command creates a conditional control structure?**

- [ ] `def`
- [ ] `delay`
- [x] ✅ `if`
- [ ] `from`

> **Explanation:** The commands `if` and `else` are used for conditional logic. `for` and `while` are for repetition, and `def` is for defining functions.

**11. What is displayed after the following code is entered into a Python interpreter?**

```python
addition = 22 + 10
print(addition)
```

- [ ] (syntax error) - as there should not be a space between the numerical values
- [ ] [22]+[10]
- [x] ✅ 32
- [ ] nothing (because the print command is wrong)

> **Explanation:** The Python interpreter will perform the mathematical addition operation and display the result, 32.

**12. What is the output when the following code is entered into a Python program interpreter?**

```python
[1,2,4,5] + [3,6]
```

- [x] ✅ `[1,2,4,5,3,6]`
- [ ] `[1,2,3,4,5,6]`
- [ ] `[12]+[9]`
- [ ] `[21]`

> **Explanation:** The Python interpreter performs concatenation of two lists using the `+` operator without reordering the list elements.

**13. A student is learning Python in the interactive interpreter mode. The student issues the commands:**

```python
>>> y=2
>>> y*3
6
>>> 'Test'*y
```

**What is the result?**

- [ ] ‘Test2’
- [ ] ‘Test6’
- [x] ✅ ‘TestTest’
- [ ] ‘TestTestTestTestTestTest’
- [ ] TypeError: A string type cannot be multiplied by an integer.

> **Explanation:** Multiplying a string by an integer in Python produces multiple copies of the string. Because `y` is 2, the word 'Test' is listed twice.

**14. A student new to Python is working in the interactive interpreter mode. The student issues the commands:**

```python
>>> devicenames=["RT1", "RT2", "SW1", "SW2"]
>>> hostnames=devicenames + ["RT3", "SW3"]
>>> del hostnames[3]
>>> hostnames
```

**What is the result?**

- [ ] `['RT1', 'RT2', 'SW2', 'RT3', 'SW3']`
- [x] ✅ `['RT1', 'RT2', 'SW1', 'RT3', 'SW3']`
- [ ] `['RT1', 'RT2', 'RT3', 'SW2', 'SW3']`
- [ ] `['RT1', 'RT2', 'SW1', 'SW2', 'SW3']`

> **Explanation:** The lists are concatenated to form `['RT1', 'RT2', 'SW1', 'SW2', 'RT3', 'SW3']`. Indexing starts at 0, so index `3` is `'SW2'`. Deleting index 3 removes `'SW2'`.

**15. A student new to Python is working in the interactive interpreter mode. The student issues the command:**

```python
>>> ipAddress = {"R1":"10.1.1.1","R2":"10.2.2.1","R3":"10.3.3.1"}
```

**Which data type is used to represent the variable ipAddress?**

- [ ] list
- [ ] tuple
- [ ] array
- [x] ✅ dictionary

> **Explanation:** A dictionary in Python is created by placing a sequence of elements within curly braces `{}`, separated by commas, in the format of `key:value`.

**16. A student new to Python is working in the interactive interpreter mode. The student issues the command:**

```python
>>> ipAddress = {"R1":"10.1.1.1","R2":"10.2.2.1","R3":"10.3.3.1"}
```

**Which Python expression can be used to retrieve the IP address of R2?**

- [ ] `ipAddress[R2]`
- [x] ✅ `ipAddress['R2']`
- [ ] `ipAddress{'R2'}`
- [ ] `ipAddress{"R2"}`

> **Explanation:** An object inside a dictionary structure is referenced by using its key enclosed in square brackets `[ ]`. The key is a string, so it must be quoted.

**17. A student is learning Python and is reviewing a Python script as follows:**

```python
aclNum = int(input("What is the IPv4 ACL number? "))
if aclNum >= 1 and aclNum <= 99:
    print("This is a standard IPv4 ACL.")
elif aclNum >=100 and aclNum <= 199:
    print("This is an extended IPv4 ACL.")
else:
    print("This is not a standard or extended IPv4 ACL.")
```

**Under which condition will the `elif` statement be evaluated?**

- [ ] when the input is a string
- [x] ✅ when the if statement is false
- [ ] when the input is a float number
- [ ] when the first print statement fails

> **Explanation:** The `elif` statement is evaluated only if the preceding `if` statement evaluates to false.

---

# DevNet Associate (Version 1.0) - Module 2: The DevNet Developer Environment

**1. Which technology trend enables an industry shift towards automation, applications, and integrations?**

- [x] ✅ advanced API capabilities
- [ ] increased internet connection bandwidth
- [ ] smaller and faster CPUs
- [ ] increased storage and RAM

> **Explanation:** APIs (Application Programming Interfaces) are causing a shift in the IT industry through the replacement of repetitive manual tasks with automation.

**2. What are two benefits of using APIs and integrations between applications? (Choose two.)**

- [x] ✅ Integrations enable the applications to request actions from each other.
- [ ] Integrations enable the applications to run a Docker instance using Hyper-V.
- [ ] Integrations are used to verify compatibility between different applications.
- [x] ✅ Integrations are used to provide applications the ability to notify each other when a specific event happens.
- [ ] Integrations enable the applications to be installed on any operating system type.

> **Explanation:** Integrations build a network between multiple applications, allowing them to share data, request actions, or notify each other of specific events.

**3. What is network programmability?**

- [ ] the ability to easily monitor network devices using traditional network protocols
- [ ] the ability to configure virtualized networks and deploy virtualized services in real time
- [ ] the ability to program network devices using repetitive manual configuration via a terminal and command sets
- [x] ✅ the ability to configure, monitor, and react to events in the network in real time

> **Explanation:** Network programmability is defined as the ability to configure, monitor, and react to events in the network in real time through the use of APIs.

**4. What resources are available in the Cisco DevNet Code Exchange?**

- [ ] self-paced tutorials that cover a wide range of automation and integration topics
- [ ] support for developer-related issues using forums and live chats
- [x] ✅ a repository of sample code written by other developers
- [ ] production-like development and code testing environments

> **Explanation:** The Cisco DevNet Code Exchange provides a repository of sample code to be shared with other developers.

**5. What is the purpose of Cisco DevNet?**

- [ ] to teach specific coding courses such as advanced Python and implementing REST APIs
- [ ] to be the central resource for everything about networking at Cisco
- [ ] to be the central resource for advanced software developers and the use of Cisco APIs
- [x] ✅ to teach everyone about the different Cisco API offerings and how to use them

> **Explanation:** Cisco DevNet exists to teach everyone about the different Cisco API offerings and how to use them, in addition to teaching generic coding courses.

**6. What resources are available in the Cisco DevNet sandboxes?**

- [x] ✅ production-like development and code testing environments
- [ ] a repository of sample code written by developers
- [ ] self-paced tutorials that cover a wide range of automation and integration topics
- [ ] support for developer-related issues through the use of forums and live chats

> **Explanation:** The Cisco DevNet sandboxes provide users with production-like development and testing environments for various Cisco technologies.

**7. What are two requirements when participating in the DevNet Learning Labs? (Choose two.)**

- [ ] The user must have successfully passed the 200-901 DEVASC exam.
- [x] ✅ The user must successfully log in with a DevNet account.
- [ ] The user must have purchased the DevNet Learning Labs activation license.
- [x] ✅ The user must have an active internet connection.
- [ ] The user must install a developer environment on a local computer.

> **Explanation:** When starting the DevNet Learning Labs, the only two requirements are an internet connection and a DevNet account.

**8. Which Cisco DevNet developer support option provides 1-on-1 support to the members of the Solution Partner program?**

- [ ] community forum
- [x] ✅ case-based ticket
- [ ] chat with DevNet
- [ ] knowledge base

> **Explanation:** The case-based ticket DevNet developer support option provides 1-on-1 support for certain Cisco APIs at a cost.

**9. Which Cisco DevNet online resource provides use cases for network automation, including listing data and activating policies across domains?**

- [x] ✅ Automation Exchange
- [ ] DevNet Sandbox
- [ ] Code Exchange
- [ ] DevNet Learning Labs

> **Explanation:** The Automation Exchange provides various use cases for network automation, including listing data, adding configurations, and activating policies across domains/users/devices.

**10. What is the contracted response time after a developer opens a case-based ticket with the DevNet support service?**

- [ ] one hour
- [ ] one week
- [x] ✅ one business day
- [ ] five business days

> **Explanation:** The response time on developer support case-based tickets is within one business day.

**11. What are three major areas that comprise DevNet? (Choose three.)**

- [x] ✅ interactive and collaborative developer community
- [x] ✅ integrated community forums
- [x] ✅ coordinated developer tools
- [ ] automation and programmability standards development area
- [ ] on-line training site for various technology vendors
- [ ] providing support for website creation and maintenance

> **Explanation:** DevNet is a fully-integrated developer program consisting of a website, an interactive developer community, coordinated developer tools, integrated community forums, and sandboxes.

**12. Which link is used from the Cisco DevNet Learning Labs to access the largest collections of labs?**

- [ ] Modules
- [ ] Sections
- [ ] Bookends
- [x] ✅ Tracks

> **Explanation:** The DevNet Learning Labs consist of tracks that contain modules, and modules contain labs. Therefore, tracks represent the largest collection.

---

# DevNet Associate (Version 1.0) - Module 3: Software Development and Design

**1. Which statement describes the Waterfall methodology of software development?**

- [x] ✅ Each step in the process must be completed before the next step starts.
- [ ] Multiple steps in the process are started simultaneously.
- [ ] Process tasks are broken up into time-boxed iterations called sprints.
- [ ] It emphasizes elimination of wasted effort and maximizes customer value.

> **Explanation:** The Waterfall model is the earliest SDLC approach. The phases follow a linear sequential flow, where each phase begins only when the previous phase is complete.

**2. Which fundamental Lean principle forms the basis from which all other Lean principles flow?**

- [x] ✅ eliminate waste
- [ ] build integrity in
- [ ] deliver as fast as possible
- [ ] amplify learning

> **Explanation:** The Lean SDLC methodology is built on seven principles focused on minimizing waste and maximizing value. Eliminating waste is the most fundamental principle.

**3. Match the Lean term with a description:**

- **Story:** ✅ A concise and informal description of a specific feature or functionality from the perspective of an end-user.
- **Scrum Team:** ✅ A cross-functional group of professionals responsible for delivering the product increment during each sprint.
- **Sprint:** ✅ A time-boxed period during which the Scrum Team works on a set of prioritized tasks or user stories.
- **Backlog:** ✅ A dynamic and prioritized list of all features, enhancements, and bug fixes that need to be implemented.

**4. A developer issues the Linux command `pip3 freeze` in an activated Python 3 virtual environment. What is the function that is provided by the command?**

- [ ] to lock the current virtual environment
- [ ] to prepare the environment before installing a Python package
- [x] ✅ to output a list of installed Python packages
- [ ] to deactivate the current virtual environment

> **Explanation:** The `pip3 freeze` command is used to output a list of Python 3 packages installed in the current working environment.

**5. What is the role of the view component in the Model-View-Controller (MVC) flow?**

- [ ] It manages the data, logic and rules of the application.
- [x] ✅ It accepts selected data and displays the visual representation to the user.
- [ ] It accepts the input and applies the required rules to format the data.
- [ ] It requests user input and manipulates it to fit the format for the model.

> **Explanation:** In MVC, the controller manipulates the data, the model manages the data/logic, and the view is the visual representation of the data presented to the user.

**6. What are two characteristics of the Git version control system? (Choose two.)**

- [ ] It is Microsoft proprietary.
- [ ] It is Cisco proprietary.
- [x] ✅ It is open source.
- [x] ✅ It is a distributed VCS.
- [ ] It is a centralized VCS.
- [ ] It is a local VCS.

> **Explanation:** Git is an open-source implementation of a distributed version control system (VCS).

**7. Match the Git command with its function:**

- **git pull:** ✅ Updates the local copy of the Git repository with the content of the remote Git repository (fetches and merges).
- **git init:** ✅ Creates an empty Git repository or makes an existing folder a Git repository.
- **git push:** ✅ Updates the remote Git repository with the content changes from the local Git repository.

**8. When a unified `.diff` file is being reviewed, which symbol is used to indicate that a line has been added?**

- [x] ✅ `+`
- [ ] `-`
- [ ] `/dev/null`
- [ ] `@@`

> **Explanation:** In a unified diff file, `+` indicates an added line, `-` indicates a removed line, `/dev/null` shows a file added/removed, and `@@` indicates a new block of information.

**9. What is clean code?**

- [x] ✅ code that is easy to read and understand
- [ ] code that performs a discrete task
- [ ] code that has passed functional testing
- [ ] code that has no reviewer comments

> **Explanation:** Clean code meets common principles that make it easy to read, understand, reuse, and unit-test.

**10. A developer is constructing some functions in Python. When is a function referred to as a module in Python?**

- [ ] when the function is used for the first time
- [x] ✅ when the function is packaged in a single Python file
- [ ] when the function is initiated during the execution of a Python program
- [ ] when the function is declared during the execution of a Python program

> **Explanation:** A module in Python is essentially a Python file containing a set of functions and variables that can be reused and integrated with other modules.

**11. A student is learning Python using the interactive interpreter mode. The student issues these commands:**

```python
>>> class Url():
...     def __init__(self, host, prot):
...         self.host = host
...         self.prot = prot
...         self.url = self.prot + "://" + self.host
```

**Which command should the student use to create an object with one attribute being a valid URL?**

- [ ] `>>> url2 = Url('http', 'www.cisco.com')`
- [x] ✅ `>>> url2 = Url('www.cisco.com', 'http')`
- [ ] `>>> url2 = Url('http', '://', 'www.cisco.com')`
- [ ] `>>> url2 = Url(URL, 'http://', 'www.cisco.com')`

> **Explanation:** The `__init__` method takes `host` first, then `prot`. To form `http://www.cisco.com`, `host` must be `'www.cisco.com'` and `prot` must be `'http'`.

**12. What characteristic describes a formal code review?**

- [x] ✅ The entire code base is reviewed in a series of meetings.
- [ ] It utilizes a peer code review tool to identify code that needs retesting.
- [ ] It provides direct interaction between the review team and the code author.
- [ ] Code is automatically sent for review by source code management systems once it is checked in.

> **Explanation:** In a formal code review, developers have a series of meetings to review the whole codebase and go over the code line by line in detail.

**13. What are two features of the formal code review? (Choose two.)**

- [x] ✅ It involves a review of the entire code base in a series of meetings.
- [x] ✅ It promotes discussion among all of the reviewers.
- [ ] It involves the developer going through code with the reviewer line-by-line.
- [ ] It allows the developer to make changes on the spot.
- [ ] For a quicker turnaround, it involves only one reviewer.

> **Explanation:** Formal code reviews involve meetings to review the entire codebase line-by-line and heavily promote discussion among all reviewers.

**14. What special characters are used to enclose JSON objects?**

- [x] ✅ curly braces `{}`
- [ ] square brackets `[]`
- [ ] parenthesis `()`
- [ ] forward slash `/`

> **Explanation:** Individual objects in JSON comprise key/value pairs enclosed in curly braces `{}`. (Square brackets are used for arrays/lists).

**15. A developer issues a Linux command `python3 -m venv devenv`. What is the developer trying to achieve?**

- [x] ✅ to create a Python 3 virtual environment named devenv
- [ ] to activate the Python 3 virtual environment named devenv
- [ ] to install the devnet tool sets in the Python 3 virtual environment named venv
- [ ] to enter the Python 3 virtual environment named venv using the devnet tool sets

> **Explanation:** The syntax `python3 -m venv <name>` uses the `venv` module to create a new virtual environment with the specified name (`devenv`).
