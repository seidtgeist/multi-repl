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

Please use npm >1.0.1rc0

    cd multi-repl
    npm install
    node server.js
    open http://localhost:1337

Obvious word of caution
-----------------------

Be careful about who you give access to the service.
There are no filters or permissions (yet)!

Ideas
-----

### Expose a list of connected users inside the REPL session

For JS this could look like:

    // Initially
    repl.write("window.MultiRepl = { users: {} };\n");

    // When someone connects
    socket.on('connection', function(client){
        var sid = client.sessionId;
        repl.write('window.MultiRepl.users[' + sid + '] = { ip: '1.2.3.4' }';');
    });

Basically it's about exposing the nature of multi-repl inside the repl.
Could be fun.

### Ability to spawn different REPLs and more than one session

Quick idea for possible feature & URL design:

    http://multi-repl-host/<repl_id>/<session_id>/

### API ideas

- `GET /id`
- `GET /id/stdout`
- `GET /id/stderr`
- `POST /id`
- `POST /id/stdin`
- `DELETE /id`

List of REPLs
-------------

Here's a list of some REPLs which could be integrated into the UI.
Diverging homebrew/pip/gem package names are next to the repl's name.

- clj (clojure)
- ghci (ghc)
- ipython
- irb (ruby)
- js (spidermonkey)
- node
- python
- sbcl
- v8

