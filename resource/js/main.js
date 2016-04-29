$(function() {
    $("#search").change(function () {
        // 入力チェック
        var simplePath = $("#search").val();
        if (simplePath.length == 0) return;

        // text-fieldを畳む
        $("#search-wrap").removeClass("is-focused").removeClass("is-dirty");

        // コンテンツ取得
        var path = "contents/" + simplePath + ".json"
        $.ajax({
            url: path,
            success: function(data){
                console.log(data);
                $("#flipbox").text(data[0].ja);
            },
            error: function(data){
                $("#flipbox").text("Not Found");
            },
        });
    });

});
