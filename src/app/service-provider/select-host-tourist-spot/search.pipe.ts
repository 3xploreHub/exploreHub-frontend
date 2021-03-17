import { Pipe, PipeTransform } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Pipe({
    name:'search',
})

export class SearchPipe implements PipeTransform {
    transform(spots: string[], searchInput: string, inputSplitBySpace: string[], inputSplitByCommas: string[], joinSplitBySpace: string, joinSplitByCommas: string,): any[]{     
        if(!searchInput) {
            return  [];
        }
        searchInput = searchInput.toLowerCase();
        inputSplitBySpace = searchInput.split(' ');
        joinSplitBySpace = inputSplitBySpace.join('');
        inputSplitByCommas = joinSplitBySpace.split(',');
        joinSplitByCommas = inputSplitByCommas.join(',');
        
        return spots.filter(
            x => x.toLowerCase().includes(searchInput)
        )
     }
}