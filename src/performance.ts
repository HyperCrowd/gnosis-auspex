interface Child extends HTMLCollection, Element {
  style: {
    display: string;
  };
}

interface PerformanceInstance extends Performance {
  memory: {
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

let Stats;
let Panel;

export const showPerformance = () => {
  (function (f: Window, e) {
    Stats = e();
  })(window, function () {
    var f = function (top = 0, left = 0, mode = 0) {
      function e(a) {
        c.appendChild(a.dom);
        return a;
      }

      function u(a) {
        for (var d = 0; d < c.children.length; d++)
          (c.children[d] as Child).style.display = d === a ? 'block' : 'none';
        l = a;
      }
      var l = 0,
        c = document.createElement('div');
      c.style.cssText =
        'position:fixed;top:' +
        top +
        ';left:' +
        left +
        ';cursor:pointer;opacity:0.9;z-index:10000';
      c.addEventListener(
        'click',
        function (a) {
          a.preventDefault();
          u(++l % c.children.length);
        },
        !1
      );

      var k = (performance || Date).now(),
        g = k,
        a = 0,
        r = e(new Panel('FPS', '#0ff', '#002')),
        h = e(new Panel('MS', '#0f0', '#020'));
      if (self.performance && (self.performance as PerformanceInstance).memory)
        var t = e(new Panel('MB', '#f08', '#201'));

      u(mode % c.children.length);
      // u(0);

      return {
        REVISION: 16,
        dom: c,
        addPanel: e,
        showPanel: u,
        begin: function () {
          k = (performance || Date).now();
        },
        end: function () {
          a++;
          var c = (performance || Date).now();
          h.update(c - k, 200);
          if (
            c >= g + 1e3 &&
            (r.update((1e3 * a) / (c - g), 100), (g = c), (a = 0), t)
          ) {
            var d = (performance as PerformanceInstance).memory;
            t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
          }
          return c;
        },
        update: function () {
          k = this.end();
        },
        domElement: c,
        setMode: u,
      };
    };

    Panel = function (e, f, l) {
      var c = Infinity,
        k = 0,
        g = Math.round,
        a = g(window.devicePixelRatio || 1),
        r = 80 * a,
        h = 48 * a,
        t = 3 * a,
        v = 2 * a,
        d = 3 * a,
        m = 15 * a,
        n = 74 * a,
        p = 30 * a,
        q = document.createElement('canvas');
      q.width = r;
      q.height = h;
      q.style.cssText = 'width:80px;height:48px';
      var b = q.getContext('2d');
      b.font = 'bold ' + 9 * a + 'px Helvetica,Arial,sans-serif';
      b.textBaseline = 'top';
      b.fillStyle = l;
      b.fillRect(0, 0, r, h);
      b.fillStyle = f;
      b.fillText(e, t, v);
      b.fillRect(d, m, n, p);
      b.fillStyle = l;
      b.globalAlpha = 0.9;
      b.fillRect(d, m, n, p);
      return {
        dom: q,
        update: function (h, w) {
          c = Math.min(c, h);
          k = Math.max(k, h);
          b.fillStyle = l;
          b.globalAlpha = 1;
          b.fillRect(0, 0, r, m);
          b.fillStyle = f;
          b.fillText(g(h) + ' ' + e + ' (' + g(c) + '-' + g(k) + ')', t, v);
          b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);
          b.fillRect(d + n - a, m, a, p);
          b.fillStyle = l;
          b.globalAlpha = 0.9;
          b.fillRect(d + n - a, m, a, g((1 - h / w) * p));
        },
      };
    };
    return f;
  });

  const topPosition = window.innerHeight - 50 + 'px';
  var stats1 = new Stats(topPosition, '5px', 0);
  var stats2 = new Stats(topPosition, '85px', 1);
  var stats3 = new Stats(topPosition, '165px', 2);

  document.body.appendChild(stats1.dom);
  document.body.appendChild(stats2.dom);
  document.body.appendChild(stats3.dom);

  requestAnimationFrame(function loop() {
    stats1.update();
    stats2.update();
    stats3.update();
    requestAnimationFrame(loop);
  });
};
