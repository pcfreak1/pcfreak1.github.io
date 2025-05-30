function AI(e) {
    this.grid = e;
}

AI.prototype.eval = function() {
    var e = this.grid.availableCells().length;
    return 0.1 * this.grid.smoothness() + 1 * this.grid.monotonicity2() + 2.7 * Math.log(e) + 1 * this.grid.maxValue();
};

AI.prototype.search = function(e, i, r, t, o) {
    var s, n, a = -1;

    if (this.grid.playerTurn) {
        for (var l in s = i, [0, 1, 2, 3]) {
            if ((I = this.grid.clone()).move(l).moved) {
                if (t++, I.isWin()) return { move: l, score: 1e4, positions: t, cutoffs: o };

                var h = new AI(I);
                if (0 == e) {
                    n = { move: l, score: h.eval() };
                } else {
                    (n = h.search(e - 1, s, r, t, o)).score > 9900 && n.score--;
                    t = n.positions;
                    o = n.cutoffs;
                    
                    if (n.score > s) {
                        s = n.score;
                        a = l;
                    }
                    if (s > r) return { move: a, score: r, positions: t, cutoffs: ++o };
                }
            }
        }
    } else {
        s = r;
        var u = [],
            c = this.grid.availableCells(),
            f = { 2: [], 4: [] };

        for (var p in f)
            for (var v in c) {
                f[p].push(null);
                var g = c[v],
                    m = new Tile(g, parseInt(p, 10));
                this.grid.insertTile(m);
                f[p][v] = -this.grid.smoothness() + this.grid.islands();
                this.grid.removeTile(g);
            }

        var d = Math.max(Math.max.apply(null, f[2]), Math.max.apply(null, f[4]));
        for (var p in f)
            for (v = 0; v < f[p].length; v++) {
                if (f[p][v] == d) {
                    u.push({ position: c[v], value: parseInt(p, 10) });
                }
            }
        
        for (v = 0; v < u.length; v++) {
            var y = u[v].position,
                I = (p = u[v].value, this.grid.clone());
            if (m = new Tile(y, p), I.insertTile(m), I.playerTurn = !0, t++, t = (n = (h = new AI(I)).search(e, i, s, t, o)).positions, o = n.cutoffs, n.score < s && (s = n.score), s < i) {
                return { move: null, score: i, positions: t, cutoffs: ++o };
            }
        }
    }

    // Check if score reaches 2000
    if (this.grid.maxValue() >= 2000) {
        alert("Congratulations!");
    }

    return { move: a, score: s, positions: t, cutoffs: o };
};

AI.prototype.getBest = function() {
    return this.iterativeDeep();
};

AI.prototype.iterativeDeep = function() {
    var e, i = (new Date).getTime(), r = 0;
    do {
        var t = this.search(r, -1e4, 1e4, 0, 0);
        if (-1 == t.move) break;
        e = t;
        r++;
    } while ((new Date).getTime() - i < minSearchTime);
    return e;
};

AI.prototype.translate = function(e) {
    return { 0: "up", 1: "right", 2: "down", 3: "left" }[e];
};
