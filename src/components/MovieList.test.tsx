import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "@tanstack/react-router";
import MovieList from "./MovieList";

jest.mock("@tanstack/react-router", () => ({
  useRouter: jest.fn(),
}));

describe("MovieList Component", () => {
  const mockNavigate = jest.fn();
  const mockMovies = [
    {
      id: 1,
      movieTitle: "Movie 1",
      movieDescription: "Description for Movie 1",
      posterPath: "/poster1.jpg",
    },
    {
      id: 2,
      movieTitle: "Movie 2",
      movieDescription: "Description for Movie 2",
      posterPath: "/poster2.jpg",
    },
  ];
  const mockImageBaseUrl = "https://image.tmdb.org/t/p/w500";

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      subscribe: jest.fn(() => jest.fn()), // Mock subscription
    });

    // Simulate being on the root path
    Object.defineProperty(window, "location", {
      value: { pathname: "/app" },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "location", {
      value: { pathname: "/" },
      writable: true,
    });
  });

  it("renders the MovieList component", () => {
    render(<MovieList movies={mockMovies} imageBaseUrl={mockImageBaseUrl} />);

    // Check if the movie titles are rendered
    expect(screen.getByText("Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Movie 2")).toBeInTheDocument();

    // Check if the movie descriptions are rendered
    expect(screen.getByText("Description for Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Description for Movie 2")).toBeInTheDocument();

    // Check if the images are rendered
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", `${mockImageBaseUrl}/poster1.jpg`);
    expect(images[1]).toHaveAttribute("src", `${mockImageBaseUrl}/poster2.jpg`);
  });

  it("navigates to the booking page when 'Book Now' is clicked", () => {
    render(<MovieList movies={mockMovies} imageBaseUrl={mockImageBaseUrl} />);

    // Click the "Book Now" button for the first movie
    const bookNowButtons = screen.getAllByText("Book Now");
    fireEvent.click(bookNowButtons[0]);

    // Check if the navigate function was called with the correct movie ID
    expect(mockNavigate).toHaveBeenCalledWith({
      to: `/app/booking-page/1`,
    });
  });

  it("does not render the component if not on the root path", () => {
    (useRouter as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      subscribe: jest.fn((_, callback) => {
        callback(); // Simulate a route change
        return jest.fn();
      }),
    });

    // Simulate a non-root path
    Object.defineProperty(window, "location", {
      value: { pathname: "/app/other-page" },
      writable: true,
    });

    render(<MovieList movies={mockMovies} imageBaseUrl={mockImageBaseUrl} />);

    // Check that the component is not rendered
    expect(screen.queryByText("Movie 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Movie 2")).not.toBeInTheDocument();
  });
});
