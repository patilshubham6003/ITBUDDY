import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
export class Data {
  CATEGORY_ID: any = [];
  CATEGORY_NAME: string = '';
  IS_ACTIVE: boolean = true;
}
@Component({
  selector: 'app-userareamappingdrawer',
  templateUrl: './userareamappingdrawer.component.html',
  styleUrls: ['./userareamappingdrawer.component.css'],
})
export class UserareamappingdrawerComponent {
  @Input() data: any;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;

  saveData: any = new Data();
  sortValue: string = 'desc';
  sortKey: string = 'NAME';
  pageIndex = 1;
  pageSize = 10;
  unMapCategoriesData: any[] = [];
  isSpinning = false;
  allSelected = false;
  tableIndeterminate: boolean = false;
  tableIndeterminate11: boolean = false;
  selectedPincode: any[] = [];
  filterQuery: string = '';
  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  ngOnInit() {
    this.allChecked = this.mappingdata.every((item: any) => item.IS_MAPPED);
  }
  stateData: any = [];

  pincodeData: any = [];

  unMapCategories() {
    this.isSpinning = true;
    this.isSpinning11 = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.api
      .getUnmappedAreas(0, 0, 'NAME', 'asc', ' AND STATUS=1', this.data.ID)
      .subscribe(
        (data: any) => {
          if (data['code'] === 200) {
            this.unMapCategoriesData = data['data'];
            this.originalTraineeData = [...this.unMapCategoriesData];
            this.selectedPincode = [];
          } else {
            this.unMapCategoriesData = [];
            this.selectedPincode = [];
            this.message.error('Failed To Get Unmapped Area Data...', '');
          }
          this.isSpinning = false;
          this.isSpinning11 = false;
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
          this.isSpinning = false;
          this.isSpinning11 = false;
        }
      );
  }
  sort(params: NzTableQueryParams) {
    this.isSpinning = true;
    this.isSpinning11 = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }
    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }
    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.unMapCategories();
  }
  close() {
    this.drawerClose();
  }
  Cancel() { }

  isSelectAll: boolean = false;
  toggleSelectAll(isSelectAll: boolean): void {
    if (isSelectAll) {
      this.saveData.ENTITY_ID = this.pincodeData.map(
        (pincode: any) => pincode.ID
      );
    } else {
      this.saveData.ENTITY_ID = [];
    }
  }

  unmapSelected() { }
  allSelected1: any;
  selectedPincode111: any;

  isLoading: boolean = false;
  loadingMessage: string = '';

  async toggleAll(selectAll: boolean): Promise<void> {
    this.isLoading = true;
    this.loadingMessage = selectAll
      ? 'Selecting all records. Please wait...'
      : 'Deselecting all selected records. Please wait...';

    const batchSize = 50;
    const totalRecords = this.unMapCategoriesData.length;

    const processBatch = async (startIndex: number) => {
      for (
        let i = startIndex;
        i < Math.min(startIndex + batchSize, totalRecords);
        i++
      ) {
        const item = this.unMapCategoriesData[i];
        item.selected = selectAll;

        if (selectAll) {
          this.selectedPincodeSet.add(item.ID);
          if (
            !this.selectedPincode.some((selected) => selected.ID === item.ID)
          ) {
            this.selectedPincode.push({
              AREA_ID: item.ID,
              // ENTITY_NAME: item.TYPE,
              // ENTITY_TYPE: 'T',
              IS_MAPPED: 1,
            });
          }
        } else {
          this.selectedPincodeSet.delete(item.ID);
          this.selectedPincode = this.selectedPincode.filter(
            (selected) => selected.AREA_ID !== item.ID
          );
        }
      }

      if (startIndex + batchSize < totalRecords) {
        setTimeout(() => processBatch(startIndex + batchSize), 0);
      } else {
        this.updateSelectionStates();
        this.isLoading = false;
      }
    };

    processBatch(0);
  }

  updateSelectionStates(): void {
    const totalSelected = this.unMapCategoriesData.filter(
      (item) => item.selected
    ).length;
    this.allSelected = totalSelected === this.unMapCategoriesData.length;
    this.tableIndeterminate = totalSelected > 0 && !this.allSelected;
  }

  onPincodeSelecttable(data: any, selected: boolean): void {
    data.selected = selected;

    if (selected) {
      if (!this.selectedPincode.some((item) => item.AREA_ID === data.ID)) {
        this.selectedPincode.push({
          AREA_ID: data.ID,
          // ENTITY_NAME: data.TYPE,
          // ENTITY_TYPE: 'T',
          IS_MAPPED: 1,
        });
        this.selectedPincodeSet.add(data.ID);
      }
    } else {
      this.selectedPincodeSet.delete(data.ID);
      this.selectedPincode = this.selectedPincode.filter(
        (item) => item.AREA_ID !== data.ID
      );
    }
    this.updateSelectionStates();
  }

  getFormattedData() {
    return { data: this.selectedPincode };
  }

  selectedPincode11: any = [];
  onPincodeSelecttable11(data: any, selected: boolean): void {
    data.selected = selected;
    const totalRows = this.mappingdata.length;
    const selectedRows = this.mappingdata.filter(
      (item: any) => item.selected
    ).length;

    this.allSelected1 = selectedRows === totalRows && totalRows > 0;
    this.tableIndeterminate11 = selectedRows > 0 && selectedRows < totalRows;

    this.selectedPincode11 = this.mappingdata
      .filter((item: any) => item.selected)
      .map((item: any) => item.ID);
  }

  sort11(params: NzTableQueryParams) {
    this.isSpinning = true;
    this.isSpinning22 = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }
    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }
    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.PincodeMapping111();
  }

  mappingdata: any = [];
  isSpinning22: boolean = false;
  isSpinning11: boolean = false;

  PincodeMapping111() {
    this.isSpinning = true;
    this.isSpinning22 = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.api
      .getuserAreaMapping(
        0,
        0,
        this.sortKey,
        sort,
        ' AND USER_ID =' + this.data.ID
      )
      .subscribe(
        (data: any) => {
          if (data['code'] === 200) {
            this.mappingdata = data['data'];
            this.totoalrecordsss = this.mappingdata.length;
            this.originalTraineeData1 = [...this.mappingdata];

            this.selectedPincode11 = [];
            this.allChecked =
              this.mappingdata.length > 0 &&
              this.mappingdata.every((item: any) => item.IS_MAPPED);
          } else {
            this.mappingdata = [];
            this.message.error('Failed To Get Unmapped Areas Data...', '');
          }
          this.isSpinning = false;
          this.isSpinning22 = false;
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
          this.isSpinning = false;
          this.isSpinning22 = false;
        }
      );
  }
  totoalrecordsss = 0;

  mapCities() {
    this.isSpinning = true;
    this.api.mapScope(this.data.ID, this.selectedPincode, 1).subscribe(
      (successCode: any) => {
        if (successCode['code'] === 200) {
          this.message.success('Areas Successfully Mapped to the user.', '');
          this.isSpinning = false;
          this.selectedPincode = [];
          this.selectedPincode11 = [];
          this.selectedPincodeSet = new Set();
          this.PincodeMapping111();
          this.unMapCategories();
          this.allSelected1 = false;
          this.allSelected = false;
          this.tableIndeterminate = false;
        }
        if (successCode['code'] === 409) {
          if (successCode.code === 409 && successCode.conflictAreas?.length) {
            const conflictIds = successCode.conflictAreas;

            const conflictNames = this.unMapCategoriesData
              .filter((item: any) => conflictIds.includes(item.ID))
              .map((item: any) => item.NAME);

            const areaList = conflictNames.join(', ') || conflictIds.join(', ');
            const message = `Some areas are already mapped to another user: Area Name -  ${areaList}`;

            this.message.error(message, '');
          }
        } else {
          this.message.error('Failed to Map Areas to the User', '');
        }
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }

  unmapdatatopincode() {
    this.isSpinning = true;

    this.api.mapScope(this.data.ID, this.selectedPincode11, 1).subscribe(
      (successCode: any) => {
        if (successCode['code'] === 200) {
          this.message.success('Areas Unmapped to the User.', '');
          this.isSpinning = false;
          this.selectedPincode = [];
          this.selectedPincode11 = [];
          this.PincodeMapping111();
          this.unMapCategories();
          this.allSelected1 = false;
          this.allSelected = false;
        } else {
          this.message.error('Failed to Map Areas to the User', '');
        }
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }

  marasisactive() {
    const inactiveData = this.mappingdata
      .filter((item: any) => !item.IS_MAPPED)
      .map((item: any) => item.ID);

    this.isSpinning = true;

    this.api.unMapScope(this.data.ID, inactiveData, 1).subscribe(
      (successCode: any) => {
        if (successCode['code'] === 200) {
          this.message.success('Areas Unmapped to the User.', '');
          this.isSpinning = false;
          this.selectedPincode11 = [];
          this.PincodeMapping111();
          this.allSelected1 = false;
        } else {
          this.message.error('Failed to Map Areas to the User', '');
        }
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }

  getstatussss() {
    const inactiveData = this.mappingdata
      .filter((item: any) => !item.IS_MAPPED)
      .map((item: any) => item.AREA_ID);

    return inactiveData.length == 0 ? false : true;
  }

  onPincodeSelecttable11111(data: any, selected: boolean): void {
    const dataToSend = [
      {
        AREA_ID: data.AREA_ID,
        // ENTITY_NAME: data.ENTITY_NAME,
        // ENTITY_TYPE: 'T',
        IS_MAPPED: selected,
      },
    ];

    this.isSpinning = true;

    this.api.unMapScope(this.data.ID, dataToSend, 1).subscribe(
      (response: any) => {
        if (response.code === 200) {
          if (!selected) {
            this.message.success('Area Unmapped from User.', '');
          } else {
            this.message.success('Area Successfully Mapped to the User.', '');
          }

          data.IS_MAPPED = selected;
          this.allChecked = this.mappingdata.every(
            (item: any) => item.IS_MAPPED
          );
        } else if (response.code === 207 && response.conflictAreas?.length) {
          const notFoundIds = response.conflictAreas;

          const notFoundNames = this.mappingdata
            .filter((item: any) => notFoundIds.includes(item.AREA_ID))
            .map((item: any) => item.AREA_NAME);

          const areaList = notFoundNames.length
            ? notFoundNames.join(', ')
            : notFoundIds.join(', ');

          const message = `Some areas were not mapped or already unmapped: ${areaList}`;

          this.mappingdata = [];

          this.PincodeMapping111()

          this.message.warning(message, '');
          this.allChecked = this.mappingdata.every(
            (item: any) => item.IS_MAPPED
          );
        }

        //   if (response.code === 207 && response.conflictAreas?.length) {
        //   const notFoundIds = response.conflictAreas;

        //   const notFoundNames = this.mappingdata .filter((item: any) => notFoundIds.includes(item.AREA_ID))
        //     .map((item: any) => item.AREA_NAME);

        //   const areaList = notFoundNames.join(', ') || notFoundIds.join(', ');
        //   const message = `Some areas already mapped: Area Name -  ${areaList}`;

        //   this.message.warning(message, '');
        // }
        else {
          this.message.error('Failed to Map Areas to the User.', '');
        }
        this.isSpinning = false;
      },
      (error: any) => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }

  originalTraineeData: any[] = [];

  searchskill: any;

  datalist1: any[] = [];
  selectedPincodeSet: Set<number> = new Set();
  SearchPincode(data: string): void {
    this.isSpinning = true;

    if (data && data.trim().length >= 3) {
      this.datalist1 = this.unMapCategoriesData.filter((record) => {
        return (
          record.NAME && record.NAME.toLowerCase().includes(data.toLowerCase())
        );
      });

      this.unMapCategoriesData = this.datalist1.map((record) => ({
        ...record,
        selected: this.selectedPincodeSet.has(record.ID),
      }));

      this.unMapCategoriesData.sort((a, b) => b.selected - a.selected);
    } else if (data.trim().length === 0) {
      this.unMapCategoriesData = this.originalTraineeData.map((record) => ({
        ...record,
        selected: this.selectedPincodeSet.has(record.ID),
      }));

      this.unMapCategoriesData.sort((a, b) => b.selected - a.selected);
    }

    this.isSpinning = false;
  }

  originalTraineeData1: any[] = [];

  mapsearchskill: any;
  SearchSkill(data: any) {
    this.isSpinning = true;

    if (data && data.trim().length >= 3) {
      const searchTerm = data.toLowerCase();

      this.mappingdata = this.originalTraineeData1.filter((record) => {
        return (
          record.AREA_NAME &&
          record.AREA_NAME.toLowerCase().includes(searchTerm)
        );
      });
      this.isSpinning = false;
    } else if (data.trim().length === 0) {
      this.isSpinning = false;
      this.mappingdata = [...this.originalTraineeData1];
    } else {
      this.isSpinning = false;
    }
  }

  allChecked: any;

  allChange(selected: boolean): void {
    this.allChecked = selected;
    this.isSpinning = true;
    const data = this.mappingdata;

    const dataToSend = this.mappingdata.map((item: any) => ({
      AREA_ID: item.AREA_ID,
      // ENTITY_NAME: item.ENTITY_NAME,
      // ENTITY_TYPE: 'T',
      IS_MAPPED: selected,
    }));

    this.api.unMapScope(this.data.ID, dataToSend, 1).subscribe(
      (response: any) => {
        if (response.code === 200) {
          this.mappingdata.forEach((item: any) => {
            item.IS_MAPPED = selected;
          });
          const message = selected
            ? 'All Areas Successfully Mapped to the User.'
            : 'All Areas Unmapped from the User.';
          this.message.success(message, '');
        } else if (response.code === 207 && response.conflictAreas?.length) {
          const notFoundIds = response.conflictAreas;

          const notFoundNames = this.mappingdata
            .filter((item: any) => notFoundIds.includes(item.AREA_ID))
            .map((item: any) => item.AREA_NAME);

          const areaList = notFoundNames.length
            ? notFoundNames.join(', ')
            : notFoundIds.join(', ');

          const message = `Some areas were not mapped or already unmapped: ${areaList}`;

          this.mappingdata = [];
          this.PincodeMapping111()

          this.message.warning(message, '');
          this.allChecked = this.mappingdata.every(
            (item: any) => item.IS_MAPPED
          );
        } else {
          this.message.error('Failed to Update Areas.', '');
        }
        this.isSpinning = false;
      },
      (error: any) => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }

  handleEnterKey(event: any): void {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();

      if (this.searchskill.trim().length >= 3) {
        this.SearchPincode(this.searchskill);
      } else {
      }
    }

    if (keyboardEvent.key === 'Backspace') {
      setTimeout(() => {
        if (this.searchskill.trim().length === 0) {
          this.unMapCategoriesData = this.originalTraineeData.map((record) => ({
            ...record,
            selected: this.selectedPincodeSet.has(record.ID),
          }));
          this.updateSelectionStates();

          this.unMapCategoriesData.sort((a, b) => b.selected - a.selected);
        }
      }, 0);
    }
  }

  handlepincodeEnterKey(keys: any): void {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();

      if (this.mapsearchskill.trim().length >= 3) {
        this.SearchSkill(this.mapsearchskill);
      } else {
      }
    }

    if (keyboardEvent.key === 'Backspace') {
      setTimeout(() => {
        if (this.mapsearchskill.trim().length === 0) {
          this.PincodeMapping111();
        }
      }, 0);
    }
  }
}
