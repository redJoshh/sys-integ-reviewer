# DevNet Associate (Version 1.0) - Final Exam (Modules 1-3 Topics)

**1. Which command can be used on Linux and MAC hosts to get IP addressing information?**

- [ ] `ipconfig`
- [ ] `ip address`
- [x] ✅ `ifconfig`
- [ ] `networksetup -getinfo`

> **Explanation:** Network administrators typically view the IP addressing information on Windows hosts by issuing the `ipconfig` command, and on Linux and Mac hosts by issuing the `ifconfig` command. The `networksetup -getinfo` command is used on Mac hosts to verify IP settings. The `ip address` command is used on Linux hosts to display IP addresses and properties.

**2. What platforms are provided by DevNet for community members to share solutions, tool kits, and other resources with each other?**

- [ ] communities
- [ ] forums
- [ ] sandboxes
- [x] ✅ exchanges

> **Explanation:** The Automation Exchange provides a collection of network automation use cases with different solutions and toolkits.

**3. Which two data formats can RESTCONF use when requesting data or responding with data? (Choose two.)**

- [x] ✅ JSON
- [x] ✅ XML
- [ ] YAML
- [ ] YANG
- [ ] HTML

> **Explanation:** RESTCONF can be used to access data. The RESTCONF requests and responses can use either JSON or XML structured data formats.

**4. Which DevNet resource would a developer use to look for a Python library that supports APIs for a specific Cisco product?**

- [ ] DevNet Learning Labs
- [ ] DevNet Support
- [x] ✅ Code Exchange
- [ ] DevNet Sandbox

**5. Match the DevNet exchange type with the description.**

- **automation exchange:** ✅ a collection of network automation use cases with different solutions and toolkits
- **ecosystem:** ✅ provides solutions across different technologies, industries, and geographies to jump start solution design and development
- **code:** ✅ uses the GitHub API and human moderators to categorize and display related repositories

**6. Which DevNet resource would a developer use in order to test custom code in a production-like environment?**

- [ ] DevNet Support
- [ ] DevNet Learning Labs
- [ ] Code Exchange
- [x] ✅ DevNet Sandbox

> **Explanation:** When you're developing and testing technology, you want a test bed where you can try out code within a realistic environment without affecting production systems. To do that, go to the DevNet Sandbox offering, where you can try out Cisco hardware and environments.

**7. A software development company specializes in being able to use whatever software development method their customer wants to use. One customer company wants to use the Agile method. What is a characteristic of this method?**

- [x] ✅ a software development process where the highest priority is to satisfy the customer through early and continuous delivery of valuable software
- [ ] a process that eliminates anything that does not add value to the project including meetings and documentation
- [ ] a software development process that has the results of one phase feed into the next phase
- [ ] a more traditional software development process as they have used this process in past projects

**8. What is the default shell commonly used on macOS and Linux?**

- [ ] `tcsh`
- [ ] `csh`
- [ ] Bourne
- [x] ✅ Bash

**9. Which string of characters is used to identify the beginning of a new separate document when multiple documents are in a single YAML file?**

- [ ] three slashes `///`
- [ ] three dots `...`
- [ ] three pound signs `###`
- [x] ✅ three dashes `---`

> **Explanation:** YAML files conventionally open with three dashes (`---` alone on a line) and end with three dots (`...` also alone a line). YAML also accommodates the notion of multiple "documents" within a single physical file, in this case, separating each document with three dashes on its own line.

**10. What is the difference between functions and methods in the Python programming structure?**

- [ ] Functions can use global variables whereas methods can only use local variables.
- [ ] Functions are called by a referencing object whereas methods are called by the names.
- [ ] Functions can pass arguments whereas methods can pass only predefined keywords.
- [x] ✅ Functions are standalone code blocks whereas methods are code blocks associated with an object.

> **Explanation:** The difference between methods and functions is that functions are standalone code blocks while methods are code blocks associated with an object, typically for object-oriented programming.

**11. Which command is used to create a new Git repository?**

- [x] ✅ `git init`
- [ ] `git add`
- [ ] `git commit`
- [ ] `git clone`

**12. Which stakeholder determines the useful value of software product features in the Lean process?**

- [x] ✅ the customer
- [ ] the Scrum master
- [ ] the reviewer
- [ ] the programmer

**13. Match the SDLC phase with its description.**

- **deployment:** ✅ software is installed into the production environment
- **implementation:** ✅ code is developed according to low level and high level design documents
- **requirements & analysis:** ✅ the product owner and qualified team members gather the requirements for the software to be built

**14. What is a principle of the Lean software development model?**

- [ ] adding additional product features that the customer did not ask for so that the customer is getting more than expected
- [ ] assigning resources to multiple projects so that effort can be divided on more than one task at a time
- [x] ✅ making decisions as late as possible in the process so that more facts and details are available
- [ ] ordering workers to do tasks they may not want to do to ensure they get done

**15. What character is used to separate the key and value pairs in YAML?**

- [x] ✅ colon `:`
- [ ] semi colon `;`
- [ ] underscore `_`
- [ ] forward slash `/`

**16. Which git command is used to compare changes between files?**

- [x] ✅ `git diff`
- [ ] `git merge`
- [ ] `git checkout`
- [ ] `git status`

**17. Which two HTTP functions correspond to the UPDATE function in CRUD? (Choose two.)**

- [ ] POST
- [ ] DELETE
- [x] ✅ PATCH
- [x] ✅ PUT
- [ ] GET

> **Explanation:** CRUD is an acronym that stands for CREATE, READ, UPDATE, and DELETE. The HTTP functions that correspond to CRUD functions are as follows: GET -> READ, POST -> CREATE, PUT/PATCH -> UPDATE, DELETE -> DELETE.

**18. Match the term to the REST API request: `http://example.com/update/person?id=42&email=person%40example.com`**

- **scheme:** ✅ `http`
- **path:** ✅ `update/person`
- **authority:** ✅ `example.com`
- **query:** ✅ `id=42&email=person%40example.com`

**19. Which HTTP status code category is used in the response to indicate that a REST API request contains an error on the client side?**

- [ ] 1xx
- [ ] 2xx
- [ ] 3xx
- [x] ✅ 4xx
- [ ] 5xx

> **Explanation:** 4xx - client error: Responses with a 4xx code means that the request contains an error, such as bad syntax or invalid input, which prevents the request from being completed. The client must take action to fix these issues before resending the request.

**20. A student is learning network automation by using a REST API. The student sends a request to a network device and receives a response with the status code of 202. What does this status code mean?**

- [ ] The request was understood but has been rejected by the server.
- [ ] The request was successful and typically includes a payload.
- [x] ✅ The request has been accepted for processing, but the processing has not been completed.
- [ ] Because of a server error, the request cannot be fulfilled.

> **Explanation:** Code 202: Request has been accepted for processing and is in process.

**21. A software development company specializes in being able to use whatever software development method their customer wants to use. One customer company wants to use the Waterfall method. What is a characteristic of this method?**

- [ ] a process that amplifies learning as well as delivers as quickly as possible
- [ ] a software development process where the highest priority is to satisfy the customer through early and continuous delivery of valuable software
- [x] ✅ a software development process where a particular phase depends on the results of the previous phase
- [ ] a process that eliminates anything that does not add value to the project including meetings and documentation

> **Explanation:** With waterfalls, the water flows in one direction only. With the waterfall method, the process goes in one direction, and can never go backwards. Think of it like a relay race where one runner has to finish their distance before handing the baton off to the next person, who is waiting for them.

**22. In which SDLC phase is the software product installed into the production environment to decide if it is ready for release?**

- [ ] implementation
- [x] ✅ deployment
- [ ] design
- [ ] testing

> **Explanation:** The deployment phase takes the software from the testing phase as input. During the deployment phase, the software is installed into the production environment. If there are no deployment issues, the product manager works with the architects and qualified engineers to decide whether the software is ready to be released.

**23. Which convention is used in Python to indicate that methods and variables in a class are private and not to be used outside of the class?**

- [x] ✅ by using a single preceding underscore (`_`) for a method or variable
- [ ] by using the command `class private classname():` to start the class definition
- [ ] by using two preceding hyphens (`--`) for a method or variable
- [ ] by declaring a private method or variable in the beginning of the class definition

**24. A software development company specializes in being able to use whatever software development method their customer wants to use. One customer company wants to use the Lean method. What is a characteristic of this method?**

- [x] ✅ a process that was developed for manufacturing, but adapted to other industries
- [ ] a software development process where a particular phase depends on the results of the previous phase
- [ ] a software development process that can only go forward
- [ ] a software development method that tracks closely with the software development life cycle

**25. A student is learning REST API application. The student constructs a URI to query the MapQuest API for a route from New York, NY to Boston, MA. What is the valid URI format?**

- [ ] `https://www.mapquestapi.com/directions/v2/route?key=key&from=New+York+NY&to=Boston+MA`
- [ ] `https://www.mapquestapi.com/directions/v2/route?key==key&from==New+York%2C+NY&to==Boston%2C+MA`
- [ ] `https://www.mapquestapi.com/directions/v2/route?key:key&from:New+York%2C+NY&to:Boston%2C+MA`
- [x] ✅ `https://www.mapquestapi.com/directions/v2/route?key=key&from=New+York%2C+NY&to=Boston%2C+MA`

**26. Match the Python code components to the function.**

- **`sys.exit()`:** ✅ stops the program execution
- **`str(resp.status_code)`:** ✅ converts data format
- **`api/v1/host`:** ✅ identifies API to be called
- **`verify = False`:** ✅ disables SSL handshake
- **`'content-type':'application/json'`:** ✅ identifies request data format
- **`'X-Auth-Token':ticket`:** ✅ defines API authentication

**27. What is an architectural constraint to which a true RESTful API web service must adhere?**

- [ ] It must support XML-RPC and JSON-RPC.
- [x] ✅ It allows resource caching.
- [ ] It should be behind a firewall.
- [x] ✅ It operates in a stateless way.

> **Explanation:** These are the REST constraints: Client/server, Stateless, Cache, Uniform interface, Layered system, Code on demand.

**28. A developer issues a Linux command `python3 -m venv devenv`. What is the developer trying to achieve?**

- [ ] to install the devnet tool sets in the Python 3 virtual environment named venv
- [x] ✅ to create a Python 3 virtual environment named devenv
- [ ] to activate the Python 3 virtual environment named devenv
- [ ] to enter the Python 3 virtual environment named venv using the devnet tool sets

> **Explanation:** The syntax for creating a Python 3 virtual environment in a Linux system is `python3 -m venv virtual_environment`, where `venv` is the Python 3 module to create a virtual environment and `-m` is the switch to tell Python 3 the venv module is to be used.
