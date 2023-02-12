import { Component , Input , OnChanges , Output , EventEmitter} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent implements OnChanges {
    @Input() totalPages = 0;
    @Input() totalItems = 0;
    @Input() searchString = '';
    @Input() filter = '';

    @Output() onPageChange: EventEmitter<Object> = new EventEmitter();

    public pages: number [] = [];
    activePage: number = 1;
    perPage: number = 0;

    ngOnChanges(): any {
      this.pages = this.getArrayOfPage(this.totalPages);
      this.activePage = 1;
    }

    private getArrayOfPage(totalPages: number): number [] {
      const pageArray: number[] = [];

      for(let i = 1; i <= totalPages; i++) {
        pageArray.push(i);
      }

      if(pageArray.length <= 1) return pageArray.slice(0, 0);
      if(pageArray.length === 2) return pageArray.slice(0, 2);
      if(pageArray.length > 2) return pageArray.slice(0, 3);

      return pageArray;
    }

    onClickPage(pageNumber: number): void {
        if (pageNumber >= 1 && pageNumber <= this.totalPages) {
            this.activePage = pageNumber;

            this.pages = this.updatePageArray(pageNumber, this.totalPages);

            const obj = {page: this.activePage, searchString: this.searchString, filter: this.filter}
            this.onPageChange.emit(obj);
        }
    }

    private updatePageArray(pageNumber:number, totalPages: number): number[] {
      if (totalPages === 2) {
        if(pageNumber !== 1 && pageNumber < totalPages) {
            return [pageNumber, pageNumber + 1];
        }
        if (pageNumber === totalPages) {
            return [pageNumber - 1, pageNumber];
        }
      } else if (totalPages > 2) {
        if(pageNumber !== 1 && pageNumber < totalPages) {
          return [pageNumber - 1, pageNumber, pageNumber + 1];
        }
        if (pageNumber === totalPages) {
          return [pageNumber -2, pageNumber - 1, pageNumber];
        }
      }

        return this.getArrayOfPage(this.totalPages);
    }
}
