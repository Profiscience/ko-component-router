import ko from 'knockout'
import template from './template.html'
import viewModel from './viewmodel'

ko.components.register('user-card', { template, viewModel, synchronous: true })
