import { TuringMachinePage } from './app.po';

describe('turing-machine App', function() {
  let page: TuringMachinePage;

  beforeEach(() => {
    page = new TuringMachinePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
