$:.push File.expand_path('../lib', __FILE__)

# Maintain your gem's version:
require 'instaction_js/version'

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = 'instaction_js'
  s.version     = InstactionJs::VERSION
  s.authors     = ['Rudolf Hattenkofer']
  s.email       = ['rudolf@geardev.de']
  s.homepage    = 'https://github.com/RudolfHattenkofer/instaction_js'
  s.summary     = 'Instant actions for Javascript'
  s.description = 'Runs actions instantly on newly inserted DOM elements with a given selector.'
  s.license     = 'MIT'

  s.files = Dir['{app,lib}/**/*', 'MIT-LICENSE', 'README.rdoc']

  s.add_dependency 'rails', '>= 4.2.0'
  s.add_dependency 'railties', '>= 4.2.0'
end
