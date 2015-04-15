describe('value assigners', function() {
  describe('by default', function() {
    beforeEach(function() {
      this.valueAssigners = Backbone.Syphon.ValueAssigners;
      this.obj = {
        foo: undefined,
        bar: []
      };
    });

    describe('for default type', function() {
      beforeEach(function() {
        var defaultValueAssigner = this.valueAssigners.get();
        this.valueAssignerFn = defaultValueAssigner(1);
      });

      describe('for a scalar', function() {
        it('should set value', function() {
          this.valueAssignerFn(this.obj, 'foo');
          expect(this.obj.foo).to.equal(1);
        });

        it('should override the value', function() {
          this.obj.foo = 0;
          this.valueAssignerFn(this.obj, 'foo');
          expect(this.obj.foo).to.equal(1);
        });
      });

      describe('for an array', function() {
        it('should set value', function() {
          this.valueAssignerFn(this.obj, 'bar');
          expect(this.obj.bar).to.have.length(1);
          expect(this.obj.bar[0]).to.equal(1);
        });

        it('should override the value', function() {
          this.obj.bar.push(0);
          this.valueAssignerFn(this.obj, 'bar');
          expect(this.obj.bar[1]).to.equal(1);
        });
      });
    });

    describe('for radio type', function() {
      beforeEach(function() {
        this.radioValueAssigner = this.valueAssigners.get('radio');
      });

      describe('for a scalar', function() {
        it('should set value', function() {
          var valueAssignerFn = this.radioValueAssigner(1);
          valueAssignerFn(this.obj, 'foo');
          expect(this.obj.foo).to.equal(1);
        });

        it('should be possible to set a null value', function() {
          var valueAssignerFn = this.radioValueAssigner(null);
          valueAssignerFn(this.obj, 'foo');
          expect(this.obj.foo).to.equal(null);
        });

        it('should override existing null value', function() {
          this.obj.foo = null;

          var valueAssignerFn = this.radioValueAssigner(1);
          valueAssignerFn(this.obj, 'foo');
          expect(this.obj.foo).to.equal(1);
        });

        it('should override existing undefined value', function() {
          this.obj.foo = undefined;

          var valueAssignerFn = this.radioValueAssigner(1);
          valueAssignerFn(this.obj, 'foo');
          expect(this.obj.foo).to.equal(1);
        });

        it('should not override existing value different from undefined or null', function() {
          this.obj.foo = 1;

          var valueAssignerFn = this.radioValueAssigner(2);
          valueAssignerFn(this.obj, 'foo');
          expect(this.obj.foo).to.equal(1);
        });
      });

      describe('for an array', function() {
        it('should set value', function() {
          var valueAssignerFn = this.radioValueAssigner(1);
          valueAssignerFn(this.obj, 'bar');
          expect(this.obj.bar).to.have.length(1);
          expect(this.obj.bar[0]).to.equal(1);
        });

        it('should be possible to set a null value', function() {
          var valueAssignerFn = this.radioValueAssigner(null);
          valueAssignerFn(this.obj, 'bar');
          expect(this.obj.bar).to.have.length(1);
          expect(this.obj.bar[0]).to.equal(null);
        });

        it('should override a null value', function() {
          var valueAssignerFn = this.radioValueAssigner(1);
          this.obj.bar.push(null);
          valueAssignerFn(this.obj, 'bar');
          expect(this.obj.bar).to.have.length(1);
          expect(this.obj.bar[0]).to.equal(1);
        });

        it('should override an undefined value', function() {
          var valueAssignerFn = this.radioValueAssigner(1);
          this.obj.bar.push(undefined);
          valueAssignerFn(this.obj, 'bar');
          expect(this.obj.bar).to.have.length(1);
          expect(this.obj.bar[0]).to.equal(1);
        });

        it('should not override a non null or undefined value', function() {
          var valueAssignerFn = this.radioValueAssigner(1);
          this.obj.bar.push(0);
          valueAssignerFn(this.obj, 'bar');
          expect(this.obj.bar).to.have.length(1);
          expect(this.obj.bar[0]).to.equal(0);
        });
      });
    });
  });

  describe('when serializing a form', function() {
    beforeEach(function() {
      this.View = Backbone.View.extend({
        render: function() {
          this.$el.html(
              '<form>' +
              '<input type="text" name="text" value="foo">' +
              '<input type="checkbox" name="bar">' +
              '<input type="checkbox" name="bar2" checked>' +
              '<input type="radio" name="foo" value="a">' +
              '<input type="radio" name="foo" value="b">' +
              '<input type="radio" name="foo2" value="a" checked>' +
              '<input type="radio" name="foo2" value="b">' +
              '<input type="radio" name="radio[]" value="a" checked>' +
              '<input type="radio" name="radio[]" value="b">' +
              '</form>'
          );
        }
      });

      this.view = new this.View();
      this.view.render();
      this.result = Backbone.Syphon.serialize(this.view);
    });

    it('should have a correct value for text input', function() {
      expect(this.result).to.have.ownProperty('text');
      expect(this.result.text).to.equal('foo');
    });

    it('should have a correct value for a non checked checkbox', function() {
      expect(this.result).to.have.ownProperty('bar');
      expect(this.result.bar).to.equal(false);
    });

    it('should have a correct value for a checked checkbox', function() {
      expect(this.result).to.have.ownProperty('bar2');
      expect(this.result.bar2).to.equal(true);
    });

    it('should set a null value for non checked radio', function() {
      expect(this.result).to.have.ownProperty('foo');
      expect(this.result.foo).to.equal(null);
    });

    it('should set a null value for checked radio', function() {
      expect(this.result).to.have.ownProperty('foo2');
      expect(this.result.foo2).to.equal('a');
    });

    it('should have a correct value for radio array', function() {
      expect(this.result).to.have.ownProperty('radio');
      expect(this.result.radio).to.be.an('array');
      expect(this.result.radio).to.have.length(1);
      expect(this.result.radio[0]).to.equal('a');
    });
  });

  describe('when specifying value assigners in the options for serialize', function() {
    beforeEach(function() {
      this.View = Backbone.View.extend({
        render: function() {
          this.$el.html(
              '<form>' +
              '<input name="bar" value="a">' +
              '<input name="foo" value="b">' +
              '</form>'
          );
        }
      });

      this.valueAssigners = new Backbone.Syphon.ValueAssignerSet();

      // this value assigners add a prefix to all values.
      this.valueAssigners.registerDefault(function(value) {
        var prefixValue = function(value) {
          return 'foo-' + value;
        };

        return function(obj, key) {
          var v = prefixValue(value);

          if (_.isArray(obj[key])) {
            obj[key].push(v);
          } else {
            obj[key] = v;
          }
        };
      });

      this.view = new this.View();
      this.view.render();

      this.result = Backbone.Syphon.serialize(this.view, {
        valueAssigners: this.valueAssigners
      });
    });

    it('should use the specified value assigners', function() {
      expect(this.result).to.have.ownProperty('bar');
      expect(this.result.bar).to.equal('foo-a');

      expect(this.result).to.have.ownProperty('foo');
      expect(this.result.foo).to.equal('foo-b');
    });
  });
});
