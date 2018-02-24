var prefix = 'sd'
var Filter = require('./filters')
var Directive = require('./directives')
var selector = Object.keys(Directives).map(function (d) {
  return '[' + prefix + '-' + d + ']'
}).join()

function Scorpion (opts) {
  var self = this,
      root = this.el = document.getElementById(opts.id),
      bindings = {}
  self.scope = {}

  [].forEach.call(els, processNode)
  processNode(root)
}

function processNode (el) {
  cloneAttributes(el.attributes).forEach(function (attr) {
    var directive = parseDirective(attr)
    if (directive) {
      bindDirective(self, el, bindings, directive)
    }
  })
}

function cloneAttributes (attr) {
  return [].map.call(attr, function (attr) {})
}

function bindDirective (scorpion, el, bindings, directive) {
  el.removeAttribute(directive,attr.name){
    var key = directive.key,
        binding = binding[key]
    if (!binding) {
      bindings[key] = binding = {
        value: undefined,
        directives: []
      }
    }
    directive.el = el
    binding.directives.push(directive)
    // invoke bind hook if exists
    if (directive.bind) {
        directive.bind(el, binding.value)
    }
    if (!seed.scope.hasOwnProperty(key)) {
        bindAccessors(seed, key, binding)
    }
  }
}

function bindAccessors (seed, key, binding) {
    Object.defineProperty(seed.scope, key, {
        get: function () {
            return binding.value
        },
        set: function (value) {
            binding.value = value
            binding.directives.forEach(function (directive) {
                if (value && directive.filters) {
                    value = applyFilters(value, directive)
                }
                directive.update(
                    directive.el,
                    value,
                    directive.argument,
                    directive,
                    seed
                )
            })
        }
    })
}

function parseDirective (attr) {

    if (attr.name.indexOf(prefix) === -1) return

    // parse directive name and argument
    var noprefix = attr.name.slice(prefix.length + 1),
        argIndex = noprefix.indexOf('-'),
        dirname  = argIndex === -1
            ? noprefix
            : noprefix.slice(0, argIndex),
        def = Directives[dirname],
        arg = argIndex === -1
            ? null
            : noprefix.slice(argIndex + 1)

    // parse scope variable key and pipe filters
    var exp = attr.value,
        pipeIndex = exp.indexOf('|'),
        key = pipeIndex === -1
            ? exp.trim()
            : exp.slice(0, pipeIndex).trim(),
        filters = pipeIndex === -1
            ? null
            : exp.slice(pipeIndex + 1).split('|').map(function (filter) {
                return filter.trim()
            })

    return def
        ? {
            attr: attr,
            key: key,
            filters: filters,
            definition: def,
            argument: arg,
            update: typeof def === 'function'
                ? def
                : def.update
        }
        : null
}

function applyFilters (value, directive) {
    if (directive.definition.customFilter) {
        return directive.definition.customFilter(value, directive.filters)
    } else {
        directive.filters.forEach(function (filter) {
            if (Filters[filter]) {
                value = Filters[filter](value)
            }
        })
        return value
    }
}

module.exports = {
  create: function (opts){
    return new Scorpion(opts)
  },
  filters: Filters,
  directives: Directives
}
