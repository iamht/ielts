var game24 = {};
game24.card52 = new Array(52);
game24.getCardList = function () {
    // return a list of 52 cards 
    var types = ['suitdiamonds', 'suithearts', 'suitclubs', 'suitspades'];
    var cnt = 0;
    for (var i = 1; i <= 13; i++) {
        for (var j = 0; j < 4; j++) {
            var item = {};
            item.number = i;
            item.type = types[j % 4];
            game24.card52[cnt] = item;
            cnt++;
        }
    }

    var currentIndex = 52, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = game24.card52[currentIndex];
        game24.card52[currentIndex] = game24.card52[randomIndex];
        game24.card52[randomIndex] = temporaryValue;
    }
};
game24.getCardList();

game24.showCards = function () {
    var player1 = player.get2Cards(player.cards[0]);
    var player2 = player.get2Cards(player.cards[1]);
    game24.cards = player1.concat(player2);
    for (var i = 1; i <= game24.cards.length; i++) {
        var el = document.getElementById("card" + i);
        var number = game24.cards[i - 1].number;
        var show = number + "";
        if (number == 1) {
            show = "A";
        } else if (number == 11) {
            show = "J";
        } else if (number == 12) {
            show = "Q";
        } else if (number == 13) {
            show = "K";
        }
        el.innerHTML = "<p>" + show + "</p>";
        el.setAttribute("class", "card " + game24.cards[i - 1].type);
        document.getElementById("inCard" + i).value = number;
    }
    document.getElementById("showBtn").disabled = true;
    document.getElementById("hintBtn").disabled = false;
    document.getElementById("drawBtn").disabled = false;
    document.getElementById("failBtn1").disabled = false;
    document.getElementById("failBtn2").disabled = false;
    document.getElementById("player1").innerHTML = player.cards[0].length;
    document.getElementById("player2").innerHTML = player.cards[1].length;
    document.getElementById("hints").innerHTML = "";
};

game24.showCards2 = function () {
    game24.cards = new Array(4);
    for (var i = 1; i <= 4; i++) {
        var item = {};
        item.number = document.getElementById("inCard" + i).value * 1;
        item.type = 'suitdiamonds';
        game24.cards[i - 1] = item;
        var el = document.getElementById("card" + i);
        var number = game24.cards[i - 1].number;
        var show = number + "";
        if (number == 1) {
            show = "A";
        } else if (number == 11) {
            show = "J";
        } else if (number == 12) {
            show = "Q";
        } else if (number == 13) {
            show = "K";
        }
        el.innerHTML = "<p>" + show + "</p>";
        el.setAttribute("class", "card " + game24.cards[i - 1].type);
        document.getElementById("hints").innerHTML = "";
    }
};

game24.showHint = function () {
    var rsts = [];
    var arrs = [];
    var doOperation = function (signs, n1, n2) {
        var rst = new Array(4);
        rst[0] = {};
        rst[0].signs = signs.concat(["+"]);
        rst[0].result = n1 + n2;

        rst[1] = {};
        rst[1].signs = signs.concat(["-"]);
        rst[1].result = n1 - n2;

        rst[2] = {};
        rst[2].signs = signs.concat(["*"]);
        rst[2].result = n1 * n2;

        rst[3] = {};
        rst[3].signs = signs.concat(["/"]);
        rst[3].result = n1 / n2;

        return rst;
    };
    var repeatOperation = function (arr, oArr, signs, flg) {
        var rst = doOperation(signs, arr[0], arr[1]);
        if (arr.length == 2) {
            for (var i = 0; i < rst.length; i++) {
                if (rst[i].result == 24) {
                    rst[i].arr = oArr;
                    if (flg) {
                        if (rst[i].signs[2] == "+" || rst[i].signs[2] == "-") continue;
                        var temp = rst[i].signs[0];
                        rst[i].signs.shift();
                        rst[i].signs.push(temp);
                        rst[i].back = true;
                    }
                    rsts.push(rst[i]);
                }
            }
            return;
        };
        for (var i = 0; i < rst.length; i++) {
            var newArr = arr.concat();
            newArr.splice(0, 2, rst[i].result);
            repeatOperation(newArr, oArr, rst[i].signs, flg);
        }
    };

    var sortArray = function (array) {
        for (var n = 0; n < 4; n++) {
            for (var i = 0; i < 4; i++) {
                if (i == n) continue;
                var newArr1 = [];
                var newArr2 = [];
                newArr1.push(array[n]);
                newArr1.push(array[i]);
                newArr2 = newArr1.concat();
                var min = 0, max = 0;
                for (var j = 0; j < 4; j++) {
                    if (j == i || j == n) continue;
                    if (min == 0) {
                        min = array[j];
                    } else {
                        max = array[j];
                    }
                }
                newArr1.push(min);
                newArr1.push(max);
                newArr2.push(max);
                newArr2.push(min);
                arrs.push(newArr1);
                arrs.push(newArr2);
            }
        }
    }

    var getExp = function (o) {
        var rst;
        if (o.back) {
            rst = [
                "(",
                o.arr[0],
                o.signs[0],
                o.arr[1],
                ")",
                o.signs[1],
                "(",
                o.arr[2],
                o.signs[2],
                o.arr[3],
                ")"
            ];
        } else {
            rst = new Array();
            rst.push(o.arr[3]);
            rst.push(o.signs[2]);
            var cnt = 0;
            if (o.signs[2] == "*" || o.signs[2] == "/") {
                if (o.signs[1] == "+" || o.signs[1] == "-") {
                    rst.push(")");
                    cnt++;
                }
            }
            rst.push(o.arr[2]);
            rst.push(o.signs[1]);
            if (o.signs[1] == "*" || o.signs[1] == "/") {
                if (o.signs[0] == "+" || o.signs[0] == "-") {
                    rst.push(")");
                    cnt++;
                }
            }
            rst.push(o.arr[1]);
            rst.push(o.signs[0]);
            rst.push(o.arr[0]);
            for (var i = 0; i < cnt; i++) {
                rst.push("(");
            }
            rst.reverse();
        }
        return rst.join(" ");
    };

    var initArr = [];
    for (var i = 0; i < game24.cards.length; i++) {
        initArr.push(game24.cards[i].number);
    }

    sortArray(initArr);
    for (var i = 0; i < arrs.length; i++) {
        repeatOperation(arrs[i], arrs[i], [], false);
        var newArr = new Array(3);
        newArr[0] = arrs[i][0];
        newArr[1] = arrs[i][1];
        newArr[2] = arrs[i][2] + arrs[i][3];
        repeatOperation(newArr, arrs[i], ["+"], true);
        newArr[2] = arrs[i][2] - arrs[i][3];
        repeatOperation(newArr, arrs[i], ["-"], true);
    }
    var strs = "";
    for (var i = 0; i < rsts.length; i++) {
        var rst = rsts[i];
        var str = getExp(rst);
        strs = strs + "<br>" + str;
    }
    if (strs == "") {
        document.getElementById("hints").innerHTML = "no result";
    } else {
        document.getElementById("hints").innerHTML = strs;
    }
};

game24.draw = function () {
    player.cards[0].push(game24.cards[0]);
    player.cards[0].push(game24.cards[1]);
    player.cards[1].push(game24.cards[2]);
    player.cards[1].push(game24.cards[3]);
    game24.cards = [];
    game24.setBtnStatus1();
};

game24.setBtnStatus1 = function() {
    var el1 = document.getElementById("card1");
    el1.innerHTML = "<p>二</p>";
    el1.setAttribute("class", "card suitdiamonds");
    var el2 = document.getElementById("card2");
    el2.innerHTML = "<p>十</p>";
    el2.setAttribute("class", "card suithearts");
    var el3 = document.getElementById("card3");
    el3.innerHTML = "<p>四</p>";
    el3.setAttribute("class", "card suitclubs");
    var el4 = document.getElementById("card4");
    el4.innerHTML = "<p>点</p>";
    el4.setAttribute("class", "card suitspades");
    document.getElementById("showBtn").disabled = false;
    document.getElementById("hintBtn").disabled = true;
    document.getElementById("drawBtn").disabled = true;
    document.getElementById("failBtn1").disabled = true;
    document.getElementById("failBtn2").disabled = true;
    document.getElementById("player1").innerHTML = player.cards[0].length;
    document.getElementById("player2").innerHTML = player.cards[1].length;
    document.getElementById("hints").innerHTML = "";
};

var player = {};
player.cards = new Array(2);
player.cards[0] = game24.card52.slice(0, 26);
player.cards[1] = game24.card52.slice(26);
player.get2Cards = function (arr) {
    // return 4 random cards
    var chooseIndexs = [];
    for (var i = 0; i < 2; i++) {
        if (i == 0) {
            chooseIndexs.push(Math.floor(Math.random() * arr.length));
        } else {
            var x = Math.floor(Math.random() * arr.length);
            while (chooseIndexs.indexOf(x) > -1) {
                x = Math.floor(Math.random() * arr.length);
            }
            chooseIndexs.push(x);
        }
    }

    var rst = [];
    for (var i = 0; i < chooseIndexs.length; i++) {
        rst.push(arr[chooseIndexs[i]]);
        arr.splice(chooseIndexs[i], 1);
    }
    return rst
};
player.fail = function (n) {
    var i = n * 1;
    player.cards[i].push(game24.cards[0]);
    player.cards[i].push(game24.cards[1]);
    player.cards[i].push(game24.cards[2]);
    player.cards[i].push(game24.cards[3]);
    game24.cards = [];
    game24.setBtnStatus1();
    if (player.cards[0].length == 0) {
        alert("Game Over! 甲方输了");
        document.getElementById("showBtn").disabled = true;
        return;
    }

    if (player.cards[1].length == 0) {
        alert("Game Over! 乙方输了");
        document.getElementById("showBtn").disabled = true;
        return;
    }
}



