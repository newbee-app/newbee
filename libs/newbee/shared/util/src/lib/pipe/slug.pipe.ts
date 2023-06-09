import { NgModule, Pipe, PipeTransform } from '@angular/core';
import slug from 'slug';

/**
 * A pipe for formatting a slug.
 */
@Pipe({
  name: 'slug',
})
export class SlugPipe implements PipeTransform {
  /**
   * Slugify a plain string.
   *
   * @param value The plain string to slugify.
   */
  transform(value: string) {
    return slug(value);
  }
}

@NgModule({
  providers: [SlugPipe],
  declarations: [SlugPipe],
  exports: [SlugPipe],
})
export class SlugPipeModule {}
