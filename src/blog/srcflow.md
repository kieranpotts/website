---
title: SrcFlow (draft)
description: Introducing SrcFlow, a simple, scalable workflow for managing change in software projects.
draft: true
date: 2029-09-06
tags:
  - HTML
  - CSS
  - JavaScript
---


## The problem

Version control systems are the backbone of modern software development operations.

There are many version control systems, but it is [Git](https://git-scm.com/) that has emerged as the industry standard. Git is free and open source, and as a distributed system it is capable of handling change in software at huge scale and velocity.

Git is also enormously flexible. It does not enforce any particular workflow. Developers are free to adopt any version control strategy.

Git's unopinionated nature obliges the maintainers of software projects to think about how they want source code changes to trickle through the version control system. All software projects that use Git for version control require policies for branching and merging.

Many software houses turn to off-the-shelf branching and merging strategies such as [GitFlow](http://nvie.com/posts/a-successful-git-branching-model/), [GitHub Flow](http://scottchacon.com/2011/08/31/github-flow.html), [GitLab Flow](https://about.gitlab.com/2014/09/29/gitlab-flow/) and [Atlassian's Simple Git Workflow](https://www.atlassian.com/git/articles/simple-git-workflow-is-simple).

But these workflows do not bind version control to wider software development operations. They offer no guidance on how issue tracking, code review, testing and other quality controls should fit into the version control pipeline.

The effect is that version control workflows often fit awkwardly with wider software development operations.

Misalignment between the various processes, policies and supporting infrastructure in an organisation's software development workflow introduces friction, dragging on development velocity. And disjointed change management processes can expose gaps in quality controls, through which software defects slip out to production.


## The solution

SrcFlow offers a more joined-up software development workflow.

SrcFlow regulates the whole software development life cycle. ... Development operations are highly integrated with version control .... SrcFlow's branching and merging strategy _models_ the life cycle steps of software change requests. Because the version control strategy models real world development processes, it feels intuitive and natural.

The Git version control system sits at the centre of SrcFlow, but other operations infrastructure such as issue trackers and code review tools are required, too. That's because SrcFlow is more than a branching and merging strategy. It also specifies how issues should be written and tagged, how code changes should be reviewed, how integrations should be handled, and how software releases should be prepared and versioned.


But no software development framework will be a perfect fit for every software project. SrcFlow is intended to be a change management _framework_ rather than a strict, standardised _process_. Lead developers are encouraged to pick the components of SrcFlow that will be beneficial for their projects, and modify or discard the rest. Think of SrcFlow as a _starter kit_ for your own software development framework.
