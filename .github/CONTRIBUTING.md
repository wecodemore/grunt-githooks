# Contributing to Grunt GitHooks

**First**, let us say: Thank you for contributing! :+1:

The outlined steps in this document are just guidelines, not rules, 
use your best judgment and feel free to propose changes to this document 
in [a new pull request](https://github.com/wecodemore/grunt-githooks/compare).

---

## What should I know before getting started?

In general, it's the following rule:

> Try to play nice with later developers or people using this package.

### Code of Conduct

This project adheres to the Contributor Covenant 
[code of conduct](http://contributor-covenant.org/version/1/4/) v1.4.
By participating, you are expected to uphold this code.
Please report unacceptable behavior to [wecodemore@gmail.com](mailto:wecodemore@gmail.com).
In case you would like to propose a better or more throughout COC, please file 
[a new pull request](https://github.com/wecodemore/grunt-githooks/compare).

### Submitting changes

1. Please open [an issue](https://github.com/wecodemore/grunt-githooks/issues/new) 
   to discuss your changes before filing a pull request.
2. When you send a pull request, we will love you forever.
3. Always add changes to **a new branch** named 

        git checkout -b issue-<issue number>-<topic>
        # Example
        # issue-54-travis

4. Always **file PRs against the `dev` branch**. Nothing goes to `master` without 
   going to `dev` first. In case you did not do that, please just update your 
   pull request.
5. If you include tests, we will love you in all eternity. 
   **Hint:** We can always use more test coverage.
6. When you send a pull request, please try to explain your changes. A list of 
   keywords is enough.

We will label your issue or PR accordingly so that you can filter the list of 
issues with the least effort possible. We also assign issues to milestones and 
release minor or major versions when the list of issues exceeds a certain 
threshold.

### Commit changes

Please, always write a clear log message for your commits. It's always hard 
to find changes that introduced bugs. Good messages makes it easier to trace 
things back to their origin.

We really like the 
[Angular commit message format](https://github.com/angular/angular.js/blob/5d695e5566212d93da0fc1281d5d39ffee0039a3/CONTRIBUTING.md#commit-message-format) 
a lot. Here's an example:

```
<type>(<scope>) <subject>, see #<issue number>
    <BLANK LINE>
<body>
    <BLANK LINE>
<footer (optional)>
```

Please make sure that you **always include the issue number** in a commit message. 
Else GitHub issues do not add the commits to the issues. 

 * Avoid a dot/`.` at the end of the commit message
 * Use the imperative, present tense "change", not "changed" nor "changes"
 * One change per `<body>` line

Specific example:

```
docs(test) Explain how to set up tests, see #51

Add README.md 'tests' section
Explain general tools to use
Explain local setup
Explain CI setup
```

#### Template For Submitting Bug Reports

    [Short description of problem here]

    **Reproduction Steps:**

    1. [First Step]
    2. [Second Step]
    3. [Other Steps...]

    **Expected behavior:**

    [Describe expected behavior here]

    **Observed behavior:**

    [Describe observed behavior here]

    **Screenshots and GIFs**

    ![Screenshots and GIFs which follow reproduction steps to demonstrate the problem](url)

    **OS and version:** [Enter OS name and version here]

    **Installed packages:**

    [List of installed packages here]
    [Optionally a link to your public GitHub project and blob]

    **Additional information:**

    * Problem can be reliably reproduced, doesn't happen randomly: [Yes/No]
    * Problem can be reproduced in different environments: [Yes/No]
    * Problem started happening recently, didn't happen in an older version: [Yes/No]
    * Problem happens with all files and projects, not only some files or projects: [Yes/No]
