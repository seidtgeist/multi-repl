multi-repl
==========

_Alpha version, many bugs, no tests, shame on me, told you._

Ever opened up a clojure repl or a webkit inspector console and
wanted to share it with your firends? No? Well, now you can!

multi-repl spawns an arbitrary REPL (read-eval-print loop) process
and exposes it to the web. Everyone goes into the same process (for
now). Yarrr, it's a huge deathmatch!

_You win the game if you manage to lock everyone else out._

Getting started
---------------

    node server.js
    open http://localhost:1337

Obvious word of caution
-----------------------

Be careful about who you give access to the service.
There are no filters or permissions (yet)!

List of REPLs
-------------

- clj
- ghci
- ipython
- irb
- js
- node
- python
- sbcl
- v8

