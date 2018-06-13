// fix to formidable, which handles arrays in forms
// injected here, as it is an unmerged pull request
// https://github.com/felixge/node-formidable/pull/340

const formidable = require('formidable')

formidable.IncomingForm.prototype.parse = function (req, cb) {
    this.pause = function () {
        try {
            req.pause();
        } catch (err) {
            // the stream was destroyed
            if (!this.ended) {
                // before it was completed, crash & burn
                this._error(err);
            }
            return false;
        }
        return true;
    };

    this.resume = function () {
        try {
            req.resume();
        } catch (err) {
            // the stream was destroyed
            if (!this.ended) {
                // before it was completed, crash & burn
                this._error(err);
            }
            return false;
        }

        return true;
    };

    // Setup callback first, so we don't miss anything from data events emitted
    // immediately.
    if (cb) {
        var fields = {}, files = {};
        this
            .on('field', function (name, value) {
                if (this.multiples && name.substr(name.length - 2) === '[]') {
                    name = name.substr(0, name.length - 2);
                    if (fields[name]) {
                        if (!Array.isArray(fields[name])) {
                            fields[name] = [fields[name]];
                        }
                        fields[name].push(value);
                    }
                    else {
                        fields[name] = value;
                    }
                }
                else {
                    fields[name] = value;
                }
            })
            .on('file', function (name, file) {
                if (this.multiples) {
                    if (files[name]) {
                        if (!Array.isArray(files[name])) {
                            files[name] = [files[name]];
                        }
                        files[name].push(file);
                    } else {
                        files[name] = file;
                    }
                } else {
                    files[name] = file;
                }
            })
            .on('error', function (err) {
                cb(err, fields, files);
            })
            .on('end', function () {
                cb(null, fields, files);
            });
    }

    // Parse headers and setup the parser, ready to start listening for data.
    this.writeHeaders(req.headers);

    // Start listening for data.
    var self = this;
    req
        .on('error', function (err) {
            self._error(err);
        })
        .on('aborted', function () {
            self.emit('aborted');
            self._error(new Error('Request aborted'));
        })
        .on('data', function (buffer) {
            self.write(buffer);
        })
        .on('end', function () {
            if (self.error) {
                return;
            }

            var err = self._parser.end();
            if (err) {
                self._error(err);
            }
        });

    return this;
};
