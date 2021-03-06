import _ from 'lodash';
import coreModule from '../../core_module';
import appEvents from 'app/core/app_events';

export class SearchResultsCtrl {
  results: any;
  onSelectionChanged: any;
  onTagSelected: any;
  onFolderExpanding: any;
  editable: boolean;

  /** @ngInject */
  constructor(private $location) {}

  toggleFolderExpand(section) {
    if (section.toggle) {
      if (!section.expanded && this.onFolderExpanding) {
        this.onFolderExpanding();
      }

      section.toggle(section).then(f => {
        if (this.editable && f.expanded) {
          if (f.items) {
            _.each(f.items, i => {
              i.checked = f.checked;
            });

            if (this.onSelectionChanged) {
              this.onSelectionChanged();
            }
          }
        }
      });
    }
  }

  navigateToFolder(section, evt) {
    this.$location.path(section.url);

    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  toggleSelection(item, evt) {
    item.checked = !item.checked;

    if (item.items) {
      _.each(item.items, i => {
        i.checked = item.checked;
      });
    }

    if (this.onSelectionChanged) {
      this.onSelectionChanged();
    }

    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  onItemClick(item) {
    if (this.$location.path().indexOf(item.url) > -1) {
      appEvents.emit('hide-dash-search');
    }
  }

  selectTag(tag, evt) {
    if (this.onTagSelected) {
      this.onTagSelected({$tag: tag});
    }

    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }
}

export function searchResultsDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/search/search_results.html',
    controller: SearchResultsCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {
      editable: '@',
      results: '=',
      onSelectionChanged: '&',
      onTagSelected: '&',
      onFolderExpanding: '&'
    },
  };
}

coreModule.directive('dashboardSearchResults', searchResultsDirective);
