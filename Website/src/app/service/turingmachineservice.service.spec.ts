import {TuringmachineService} from "./turingmachineservice.service";
import {TestBed} from "@angular/core/testing";
import {TsAnimationComponent} from "../turing-machine/ts-animation/ts-animation.component";
import {ExampleData} from "../turing-machine/ExampleData";
import {TuringData} from "../TuringData";
/**
 * Created by josef on 1/6/17.
 */





describe('deleteA Test', () => {
  let deleteATransition = [
    "\u03B4(s0,a) := (s1,a,R)\n",
    "\u03B4(s1,b) := (s2,a,L)\n",
    "\u03B4(s2,a) := (s2,a,L)\n",
    "\u03B4(s2,_) := (s3,_,R)\n",
    "\u03B4(s3,a) := (s0,b,R)\n",
    "\u03B4(s0,a) := (s1,a,R)\n",
    "\u03B4(s1,b) := (s2,a,L)\n",
    "\u03B4(s2,a) := (s2,a,L)\n",
    "\u03B4(s2,b) := (s3,b,R)\n",
    "\u03B4(s3,a) := (s0,b,R)\n",
    "\u03B4(s0,a) := (s1,a,R)\n",
    "\u03B4(s1,a) := (s1,a,R)\n",
    "\u03B4(s1,_) := (s4,_,L)\n",
    "\u03B4(s4,a) := (s4,_,L)\n",
    "\u03B4(s4,a) := (s4,_,L)\n",
    "\u03B4(s4,b) := (s4,b,L)\n",
    "\u03B4(s4,b) := (s4,b,L)\n",
    "\u03B4(s4,_) := (s5,_,R)\n"
  ];

  let palindrom = [
    "\u03B4(s0,a) := (s1,,R)\n",
    "\u03B4(s1,b) := (s1,b,R)\n",
    "\u03B4(s1,b) := (s1,b,R)\n",
    "\u03B4(s1,a) := (s1,a,R)\n",
    "\u03B4(s1,) := (s3,,L)\n",
    "\u03B4(s3,a) := (s5,,L)\n",
    "\u03B4(s5,b) := (s5,b,L)\n",
    "\u03B4(s5,b) := (s5,b,L)\n",
    "\u03B4(s5,) := (s0,,R)\n",
    "\u03B4(s0,b) := (s2,,R)\n",
    "\u03B4(s2,b) := (s2,b,R)\n",
    "\u03B4(s2,) := (s4,,L)\n",
    "\u03B4(s4,b) := (s5,,L)\n",
    "\u03B4(s5,) := (s0,,R)\n",
    "\u03B4(s0,) := (s6,a,N)\n",
  ];

  let service : TuringmachineService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TuringmachineService]
    });

    service = TestBed.get(TuringmachineService);
  });

  it('deleteA Testing', () => {
    service.compile(ExampleData.deleteA);
    let turingData = service.start("abba");

    let counter = 0;
    while(!turingData.isDone) {
      let transition = turingData.transition;

      if(counter === 0) {
        let deleteTransition = deleteATransition[0] + deleteATransition[1];
        expect(transition).toEqual(deleteTransition);
        counter = 1;
      } else {
        expect(transition).toEqual(deleteATransition[counter]);
      }
      counter++;
      turingData = service.step();
    }

    expect(turingData.isDone).toBeTruthy();
    expect(turingData.isEndState).toBeTruthy();
  });


  it('Palindrom Testing', () => {
    service.compile(ExampleData.palindrom);
    let turingData = service.start("abba");

    let counter = 0;
    while(!turingData.isDone) {
      let transition = turingData.transition;

      if(counter === 0) {
        let deleteTransition = palindrom[0] + palindrom[1];
        //expect(transition).toEqual(deleteTransition);
        counter = 1;
      } else {
        //expect(transition).toEqual(palindrom[counter]);
      }
      counter++;
      turingData = service.step();
    }

    expect(turingData.isDone).toBeTruthy();
    expect(turingData.isEndState).toBeTruthy();
  });
});
