import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, columns: string[]): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();
    
    return items.filter(item => {
      for (const column of columns) {
        if (item[column] && item[column].toLowerCase().includes(searchText)) {
          return true;
        }
      }
      return false;
    });
  }
}