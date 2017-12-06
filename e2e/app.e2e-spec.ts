import { DfpProjectPage } from './app.po';

describe('dfp-project App', function() {
  let page: DfpProjectPage;

  beforeEach(() => {
    page = new DfpProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
