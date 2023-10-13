export interface IGetDates {
  future: Date[];
  numberingOtherMonth: number[];
}

export const getDates = (): IGetDates => {
  const numberingOtherMonth: number[] = [];
  let future =
    Array.from(document.querySelectorAll(".fc-day-top.fc-future")) ?? [];
  const today = document.querySelector(".fc-today");
  if (today) {
    future = [today, ...future];
  }
  const dates = future
    .filter((el, i) => {
      if (el.classList.contains("fc-other-month")) {
        numberingOtherMonth.push(i);
      }
      return (
        !el.classList.contains("fc-other-month") &&
        !el.classList.contains("fc-past")
      );
    })
    .map((el) => el.getAttribute("data-date") ?? "") as unknown as Date[];
  return {
    future: dates,
    numberingOtherMonth,
  };
};
