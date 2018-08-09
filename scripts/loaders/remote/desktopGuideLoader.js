"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var guidesPath = window.GBS_DIRNAME + "/guides";
var jsonPath = window.GBS_DIRNAME + "/guides/guides.json";
var tmpPath = window.GBS_DIRNAME + "/guides_tmp";

var DesktopGuideLoader = function () {
  function DesktopGuideLoader(_ref) {
    var exercises = _ref.exercises;

    _classCallCheck(this, DesktopGuideLoader);

    this.exercises = exercises;
  }

  _createClass(DesktopGuideLoader, [{
    key: "getExercises",
    value: function getExercises() {
      var _this = this;

      return promisify(this.exercises.map(function (exercise) {
        return _.assign(exercise, {
          imageUrl: _this._makeImageUrl(exercise.path)
        });
      }));
    }
  }, {
    key: "_makeImageUrl",
    value: function _makeImageUrl(exercisePath) {
      try {
        var path = guidesPath + "/" + exercisePath;

        var bitmap = window.GBS_REQUIRE("fs").readFileSync(path + "/cover.png");
        var base64 = new Buffer(bitmap).toString("base64");
        return "data:image/png;base64," + base64;
      } catch (e) {
        console.warn(e);
        return null;
      }
    }
  }], [{
    key: "download",
    value: function download(courseSlug, onProgress) {
      courseSlug = courseSlug || "gobstones/proyectos-jr";

      var repoName = _.last(courseSlug.split("/"));
      var url = "https://github.com/" + courseSlug + "/archive/master.zip";

      var fs = window.GBS_REQUIRE("fs");
      var extract = window.GBS_REQUIRE("extract-zip");
      var ncp = window.GBS_REQUIRE("ncp");
      window.GBS_REQUIRE("setimmediate");

      var deferred = new $.Deferred();
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        if (this.status === 200) deferred.resolve(xhr.response);else deferred.reject({ status: this.status });
      };
      xhr.onprogress = function (e) {
        //if (e.lengthComputable) onProgress(e.loaded, e.total);
        onProgress(e.loaded);
      };
      xhr.send();

      return deferred.promise().then(function (file) {
        var zipPath = window.GBS_DIRNAME + "/guides.zip";
        fs.writeFileSync(zipPath, new Buffer(file));
        try {
          fs.rmdirSync(tmpPath);
        } catch (e) {}
        try {
          fs.rmdirSync(guidesPath);
        } catch (e) {}
        try {
          fs.mkdirSync(guidesPath);
        } catch (e) {}
        var deferred = new $.Deferred();
        extract(zipPath, { dir: tmpPath }, function (err) {
          if (err) deferred.reject(err);else deferred.resolve();
        });
        return deferred.promise();
      }).then(function () {
        var deferred = $.Deferred();
        ncp(tmpPath + "/" + repoName + "-master", guidesPath, function (err) {
          if (err) deferred.reject(err);else deferred.resolve();
        });
        return deferred.promise();
      });
    }
  }, {
    key: "all",
    value: function all() {
      try {
        var json = window.GBS_REQUIRE("fs").readFileSync(jsonPath);
        var guides = JSON.parse(json);

        return promisify(guides);
      } catch (e) {
        console.warn(e);
        return promisify([]);
      }
    }
  }, {
    key: "makeUrlFor",
    value: function makeUrlFor(guide, exercise) {
      var path = guidesPath + "/" + exercise.path;
      return "/" + window.GBS_PROJECT_TYPE + "?fs=" + path;
    }
  }]);

  return DesktopGuideLoader;
}();

;